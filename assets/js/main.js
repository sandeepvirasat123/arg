/* Asset Realty Group — shared site behaviour */
(() => {
  const WA_NUMBER = "919217093330";
  const IMG = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const openWhatsApp = (text) => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  const priceLabel = (lakh) => lakh >= 100 ? `₹${Number((lakh / 100).toFixed(2))} Cr` : `₹${lakh} Lakh`;

  document.documentElement.classList.add("js");

  /* ---------- Header & menu ---------- */
  const header = $(".site-header");
  const menuBtn = $(".menu-btn");
  const nav = $("#site-nav");
  const setMenu = (open) => {
    if (!menuBtn) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("open", open);
  };
  menuBtn?.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  nav?.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Toast + image fade-in ---------- */
  const toastEl = $(".toast");
  let toastTimer;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  };
  const markLoaded = (e) => { if (e.target.tagName === "IMG" && e.target.closest(".card-media")) e.target.classList.add("loaded"); };
  document.addEventListener("load", markLoaded, true);
  document.addEventListener("error", markLoaded, true);

  /* ---------- Sample inventory ----------
     Representative listings for layout and filtering. Replace with live inventory when available. */
  const LISTINGS = [
    { id: "ARG-101", title: "3 BHK Apartment", type: "Residential", bhk: 3, loc: "Greater Noida West", sub: "Sector 1", price: 115, area: 1450, baths: 3, status: "Ready to move", img: "1545324418-cc1a3fa10c00" },
    { id: "ARG-102", title: "2 BHK Apartment", type: "Residential", bhk: 2, loc: "Greater Noida West", sub: "Gaur City 2", price: 72, area: 1050, baths: 2, status: "Ready to move", img: "1502672260266-1c1ef2d93688" },
    { id: "ARG-103", title: "Office Space", type: "Commercial", bhk: 0, loc: "Noida", sub: "Sector 62", price: 95, area: 980, baths: 1, status: "Ready to move", img: "1497366811353-6870744d04b2" },
    { id: "ARG-104", title: "Residential Plot", type: "Plot", bhk: 0, loc: "Greater Noida", sub: "Yamuna Expressway", price: 125, area: 2250, baths: 0, status: "Registry ready", img: "1500382017468-9049fed747ef" },
    { id: "ARG-105", title: "4 BHK Penthouse", type: "Residential", bhk: 4, loc: "Noida", sub: "Sector 150", price: 310, area: 3200, baths: 4, status: "Ready to move", img: "1600607687939-ce8a6c25118c" },
    { id: "ARG-106", title: "2 BHK Apartment", type: "Residential", bhk: 2, loc: "Ghaziabad", sub: "Raj Nagar Extension", price: 58, area: 985, baths: 2, status: "Ready to move", img: "1522708323590-d24dbb6b0267" },
    { id: "ARG-107", title: "Retail Shop", type: "Commercial", bhk: 0, loc: "Greater Noida West", sub: "Techzone 4", price: 64, area: 420, baths: 1, status: "Under construction", img: "1486406146926-c627a92ad1ab" },
    { id: "ARG-108", title: "3 BHK Apartment", type: "Residential", bhk: 3, loc: "Greater Noida West", sub: "Bisrakh", price: 88, area: 1320, baths: 2, status: "Under construction", img: "1493809842364-78817add7ffb" },
    { id: "ARG-109", title: "Independent Villa", type: "Residential", bhk: 4, loc: "Greater Noida", sub: "Omega 1", price: 245, area: 2700, baths: 4, status: "Ready to move", img: "1613490493576-7fde63acd811" },
    { id: "ARG-110", title: "1 BHK Studio", type: "Residential", bhk: 1, loc: "Noida", sub: "Sector 75", price: 42, area: 620, baths: 1, status: "Ready to move", img: "1484154218962-a197022b5858" },
    { id: "ARG-111", title: "Commercial Office Floor", type: "Commercial", bhk: 0, loc: "Noida", sub: "Sector 132", price: 420, area: 5400, baths: 4, status: "Ready to move", img: "1554469384-e58fac16e23a" },
    { id: "ARG-112", title: "3 BHK Apartment", type: "Residential", bhk: 3, loc: "Ghaziabad", sub: "Indirapuram", price: 135, area: 1600, baths: 3, status: "Ready to move", img: "1600566753190-17f0baa2a6c3" },
    { id: "ARG-113", title: "2 BHK Apartment", type: "Residential", bhk: 2, loc: "Greater Noida West", sub: "Sector 16B", price: 68, area: 1080, baths: 2, status: "Ready to move", img: "1515263487990-61b07816b324" },
    { id: "ARG-114", title: "2 BHK Apartment", type: "Residential", bhk: 2, loc: "Noida", sub: "Sector 137", price: 78, area: 1125, baths: 2, status: "Under construction", img: "1556909114-f6e7ad7d3136" },
    { id: "ARG-115", title: "3 BHK Apartment", type: "Residential", bhk: 3, loc: "Noida", sub: "Sector 76", price: 145, area: 1650, baths: 3, status: "Ready to move", img: "1574362848149-11496d93a7c7" },
    { id: "ARG-116", title: "4 BHK Apartment", type: "Residential", bhk: 4, loc: "Greater Noida West", sub: "Gaur City 1", price: 165, area: 2150, baths: 4, status: "Ready to move", img: "1460317442991-0ec209397118" },
    { id: "ARG-117", title: "4 BHK Builder Floor", type: "Residential", bhk: 4, loc: "Ghaziabad", sub: "Indirapuram", price: 190, area: 2400, baths: 4, status: "Ready to move", img: "1600596542815-ffad4c1539a9" },
  ];

  const cardHTML = (p, i = 0) => {
    const specs = [
      p.bhk ? `<span><svg class="icon"><use href="#bed"/></svg>${p.bhk} BHK</span>` : "",
      p.baths && p.type === "Residential" ? `<span><svg class="icon"><use href="#bath"/></svg>${p.baths} Bath</span>` : "",
      `<span><svg class="icon"><use href="#area"/></svg>${p.area.toLocaleString("en-IN")} sq.ft</span>`,
    ].join("");
    const msg = `Hi ARG, I'd like to know more about ${p.title} in ${p.sub}, ${p.loc} (Ref ${p.id}, ${priceLabel(p.price)}). Can we schedule a site visit?`;
    return `<article class="card pop" style="--i:${i}">
      <div class="card-media">
        <img src="${IMG(p.img, 700)}" srcset="${[400, 700, 1000].map((w) => `${IMG(p.img, w)} ${w}w`).join(", ")}" sizes="(max-width: 700px) 100vw, (max-width: 1100px) 33vw, 25vw" decoding="async" alt="${p.title} in ${p.sub}, ${p.loc}" width="700" height="525" loading="lazy">
        <span class="pill pill-verified"><svg class="icon"><use href="#shield"/></svg>ARG Verified</span>
        <span class="card-type">${p.status}</span>
      </div>
      <div class="card-body">
        <p class="card-price">${priceLabel(p.price)} <small>· ${inr(p.price * 100000 / p.area)}/sq.ft</small></p>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-loc"><svg class="icon"><use href="#pin"/></svg>${p.sub}, ${p.loc}</p>
        <div class="card-specs">${specs}</div>
        <div class="card-actions">
          <a class="btn btn-dark" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Book a site visit</a>
          <button class="icon-btn" type="button" aria-pressed="false" aria-label="Shortlist ${p.title} in ${p.sub}" data-shortlist="${p.id}"><svg class="icon"><use href="#heart"/></svg></button>
        </div>
      </div>
    </article>`;
  };

  /* Shortlist hearts (per visitor, browser only) */
  const readShortlist = () => { try { return JSON.parse(localStorage.getItem("arg-shortlist") || "[]"); } catch { return []; } };
  const writeShortlist = (ids) => { try { localStorage.setItem("arg-shortlist", JSON.stringify(ids)); } catch { /* storage unavailable */ } };
  const syncHearts = (root) => {
    const ids = readShortlist();
    $$("[data-shortlist]", root).forEach((b) => b.setAttribute("aria-pressed", String(ids.includes(b.dataset.shortlist))));
  };
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-shortlist]");
    if (!btn) return;
    const ids = readShortlist();
    const id = btn.dataset.shortlist;
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    writeShortlist(next);
    btn.setAttribute("aria-pressed", String(next.includes(id)));
    toast(next.includes(id) ? "♥  Saved to your shortlist" : "Removed from your shortlist");
  });

  /* ---------- Home: featured listings with tabs ---------- */
  const featured = $("#featured-grid");
  if (featured) {
    const more = $("#featured-more");
    const homes = LISTINGS.filter((p) => p.type === "Residential");
    // "All homes" shows one of each size; the BHK tabs filter by bedrooms (4 = 4 BHK and larger)
    const render = (bhk) => {
      const list = bhk === "all"
        ? ["ARG-102", "ARG-101", "ARG-105", "ARG-108"].map((id) => homes.find((p) => p.id === id))
        : homes.filter((p) => (bhk === "4" ? p.bhk >= 4 : p.bhk === Number(bhk)));
      featured.innerHTML = list.slice(0, 4).map(cardHTML).join("");
      syncHearts(featured);
      if (more) more.href = `buy?type=Residential${bhk === "all" ? "" : `&bhk=${bhk}`}`;
    };
    $$("[data-featured]").forEach((tab) => tab.addEventListener("click", () => {
      $$("[data-featured]").forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      render(tab.dataset.featured);
    }));
    render("all");
  }

  /* ---------- Home: hero search tabs ---------- */
  const heroSearch = $("#hero-search");
  if (heroSearch) {
    const intentInput = $("input[name=intent]", heroSearch);
    const searchPanel = $("[data-panel=search]", heroSearch);
    const partnerPanel = $("[data-panel=partner]", heroSearch);
    // Hidden panel's fields are disabled so they are neither validated nor submitted
    const showPanel = (panel) => [searchPanel, partnerPanel].forEach((p) => {
      p.hidden = p !== panel;
      $$("input, select, button", p).forEach((el) => { el.disabled = p !== panel; });
    });
    $$(".search-tab", heroSearch).forEach((tab) => tab.addEventListener("click", () => {
      $$(".search-tab", heroSearch).forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      intentInput.value = tab.dataset.intent;
      const isPartner = tab.dataset.intent === "partner";
      showPanel(isPartner ? partnerPanel : searchPanel);
      if (!isPartner) $("button[type=submit] span", searchPanel).textContent = tab.dataset.cta;
    }));
    heroSearch.addEventListener("submit", (e) => {
      const intent = intentInput.value;
      if (intent === "sell") { e.preventDefault(); location.href = "sell"; return; }
      if (intent === "partner") {
        e.preventDefault();
        openWhatsApp(`Hi ARG, I'd like to connect about partnering with you.\nYour name: ${$("#s-name").value.trim()}\nMobile number: ${$("#s-phone").value.trim()}`);
        toast("Thanks! Our partner team will be in touch.");
      }
    });
  }

  /* ---------- Buy page: filters ---------- */
  const results = $("#results");
  if (results) {
    const form = $("#filters");
    const count = $("#result-count");
    const sort = $("#sort");
    const params = new URLSearchParams(location.search);
    ["loc", "type", "bhk", "budget"].forEach((k) => { if (params.get(k) && form.elements[k]) form.elements[k].value = params.get(k); });

    const apply = () => {
      const f = new FormData(form);
      const [min, max] = (f.get("budget") || "0-100000").split("-").map(Number);
      let list = LISTINGS.filter((p) =>
        (!f.get("loc") || p.loc === f.get("loc")) &&
        (!f.get("type") || p.type === f.get("type")) &&
        (!f.get("bhk") || (f.get("bhk") === "4" ? p.bhk >= 4 : p.bhk === Number(f.get("bhk")))) &&
        p.price >= min && p.price <= max);
      if (sort.value === "low") list = list.sort((a, b) => a.price - b.price);
      if (sort.value === "high") list = list.sort((a, b) => b.price - a.price);
      if (sort.value === "area") list = list.sort((a, b) => b.area - a.area);
      count.textContent = list.length;
      results.innerHTML = list.length ? list.map(cardHTML).join("") :
        `<div class="empty"><strong>No matching homes in our current shortlist</strong>Tell us what you need and we'll search off-market options for you.<br><br><a class="btn btn-copper btn-sm" href="contact">Share your requirement</a></div>`;
      syncHearts(results);
    };
    form.addEventListener("submit", (e) => { e.preventDefault(); apply(); results.scrollIntoView({ behavior: "smooth", block: "start" }); });
    form.addEventListener("change", apply);
    sort.addEventListener("change", apply);
    apply();
  }

  /* ---------- Sell page: 3-step valuation ---------- */
  const valuation = $("#valuation");
  if (valuation) {
    const panels = $$(".step-panel", valuation);
    const marks = $$(".stepper li", valuation);
    let current = 0;
    const show = (i) => {
      current = i;
      panels.forEach((p, idx) => { p.hidden = idx !== i; });
      marks.forEach((m, idx) => { m.classList.toggle("done", idx < i); m.classList.toggle("active", idx === i); });
      if (i === 2) {
        const f = new FormData(valuation);
        $("#summary").innerHTML = [["Property", `${f.get("ptype")} · ${f.get("config") || "—"}`], ["Location", `${f.get("society") || "—"}, ${f.get("city")}`], ["Area", f.get("area") ? `${f.get("area")} sq.ft` : "—"], ["Name", f.get("name")], ["Phone", f.get("phone")]]
          .map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("");
      }
      panels[i].querySelector("input, select")?.focus({ preventScroll: true });
    };
    const valid = (panel) => $$("input, select", panel).every((el) => el.reportValidity());
    $$("[data-next]", valuation).forEach((b) => b.addEventListener("click", () => { if (valid(panels[current])) show(current + 1); }));
    $$("[data-back]", valuation).forEach((b) => b.addEventListener("click", () => show(current - 1)));
    valuation.addEventListener("submit", (e) => {
      e.preventDefault();
      // Enter key in an early step advances instead of sending a half-filled form
      if (current < panels.length - 1) { if (valid(panels[current])) show(current + 1); return; }
      const f = new FormData(valuation);
      openWhatsApp([
        "Hi ARG, I'd like a free valuation for my property.",
        `Property: ${f.get("ptype")} · ${f.get("config") || ""}`,
        `Society / location: ${f.get("society")}, ${f.get("city")}`,
        f.get("area") ? `Area: ${f.get("area")} sq.ft` : "",
        f.get("expected") ? `Expected price: ${f.get("expected")}` : "",
        `Name: ${f.get("name")}`, `Phone: ${f.get("phone")}`,
      ].filter(Boolean).join("\n"));
    });
    show(0);
  }

  /* ---------- Generic enquiry forms → WhatsApp ---------- */
  $$("form[data-wa]").forEach((form) => form.addEventListener("submit", (e) => {
    e.preventDefault();
    const lines = [form.dataset.wa];
    $$("input, select, textarea", form).forEach((el) => {
      if (!el.name || !el.value || (el.type === "radio" && !el.checked)) return;
      const label = el.dataset.label || form.querySelector(`label[for="${el.id}"]`)?.childNodes[0]?.textContent.trim() || el.name;
      lines.push(`${label}: ${el.value}`);
    });
    openWhatsApp(lines.join("\n"));
  }));

  /* =====================================================================
     Motion & interaction
     One rAF-throttled scroll loop, one IntersectionObserver, pointer effects
     only on mouse/trackpad devices, and nothing at all for reduced motion.
     ===================================================================== */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const root = document.documentElement;

  // Stagger indexes for grouped items and the mobile menu
  $$("[data-stagger]").forEach((group) => [...group.children].forEach((el, i) => el.style.setProperty("--i", i)));
  $$(".nav-links li").forEach((el, i) => el.style.setProperty("--i", i));
  $$(".feature, .check, .path, .quote").forEach((el) => el.classList.add("spot"));

  // Split section headings into words for a line-by-line reveal
  const headings = reduce ? [] : $$(".section-head h2, .split-copy h2, .faq-side h2, .banner h2, .footer-cta h2");
  headings.forEach((h) => {
    let wi = 0;
    const walk = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const w = document.createElement("span");
          const inner = document.createElement("span");
          w.className = "w";
          inner.textContent = part;
          inner.style.setProperty("--wi", wi++);
          w.append(inner);
          frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
    });
    walk(h);
    h.classList.add("split-words");
  });

  // Count-up numbers
  const countUp = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = Number(el.dataset.count);
    if (reduce || !target) { el.textContent = target; return; }
    const start = performance.now(), dur = 1400;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(tick);
    };
    el.textContent = "0";
    requestAnimationFrame(tick);
  };

  // Reveal on scroll; revealing one item in a group reveals its siblings with a stagger
  const show = (el) => {
    if (el.classList.contains("in")) return;
    el.classList.add("in");
    if (el.classList.contains("reveal")) el.addEventListener("transitionend", () => el.classList.add("settled"), { once: true });
    $$("[data-count]", el).forEach(countUp);
    const group = el.parentElement;
    if (group && group.hasAttribute("data-stagger")) $$(":scope > .reveal", group).forEach(show);
  };
  const watched = [...$$(".reveal"), ...headings, ...$$(".skyline")];
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { show(entry.target); io.unobserve(entry.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    watched.forEach((el) => io.observe(el));
  } else {
    watched.forEach(show);
    $$("[data-count]").forEach(countUp);
  }

  // Hero word rotator
  const rot = $(".rotator em");
  if (rot && !reduce) {
    const box = rot.parentElement;
    const words = rot.dataset.words.split("|");
    let k = 0;
    // Reserve the width of the longest phrase so the headline never re-wraps when the word changes
    const fit = () => {
      const current = rot.textContent;
      box.style.width = "auto";
      const widest = Math.max(...words.map((w) => { rot.textContent = w; return box.getBoundingClientRect().width; }));
      rot.textContent = current;
      box.style.width = `${Math.ceil(widest)}px`;
    };
    fit();
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
    addEventListener("resize", fit, { passive: true });
    setInterval(() => {
      if (document.hidden) return;
      k = (k + 1) % words.length;
      rot.classList.add("out");
      setTimeout(() => {
        rot.classList.replace("out", "pre");
        rot.textContent = words[k];
        requestAnimationFrame(() => requestAnimationFrame(() => rot.classList.remove("pre")));
      }, 450);
    }, 2800);
  }

  // Pointer effects: hero parallax, card tilt, cursor spotlight
  if (finePointer && !reduce) {
    const scene = $("[data-parallax]");
    if (scene) {
      const layers = $$("[data-depth]", scene);
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      const loop = () => {
        cx += (tx - cx) * .08;
        cy += (ty - cy) * .08;
        layers.forEach((l) => { const d = Number(l.dataset.depth); l.style.translate = `${(-cx * d).toFixed(2)}px ${(-cy * d).toFixed(2)}px`; });
        raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .001 ? requestAnimationFrame(loop) : 0;
      };
      const hero = scene.closest(".hero");
      hero.addEventListener("pointermove", (e) => {
        const r = scene.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) / r.width;
        ty = (e.clientY - (r.top + r.height / 2)) / r.height;
        if (!raf) raf = requestAnimationFrame(loop);
      }, { passive: true });
      hero.addEventListener("pointerleave", () => { tx = ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    }

    let lastMove = null, moveRaf = 0;
    document.addEventListener("pointermove", (e) => {
      lastMove = e;
      if (moveRaf) return;
      moveRaf = requestAnimationFrame(() => {
        moveRaf = 0;
        const t = lastMove.target;
        if (!(t instanceof Element)) return;
        const spot = t.closest(".spot");
        if (spot) {
          const r = spot.getBoundingClientRect();
          spot.style.setProperty("--mx", `${lastMove.clientX - r.left}px`);
          spot.style.setProperty("--my", `${lastMove.clientY - r.top}px`);
        }
        const card = t.closest(".card");
        if (card) {
          const r = card.getBoundingClientRect();
          const x = (lastMove.clientX - r.left) / r.width - .5, y = (lastMove.clientY - r.top) / r.height - .5;
          card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
        }
      });
    }, { passive: true });
    document.addEventListener("pointerout", (e) => {
      const card = e.target instanceof Element && e.target.closest(".card");
      if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
    });
  }

  // Single scroll loop: progress bar, header hide/show, back-to-top, step line
  const toTop = $(".to-top");
  const stepLists = $$(".steps");
  let lastY = scrollY, ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = scrollY, max = root.scrollHeight - innerHeight;
    root.style.setProperty("--sp", max > 0 ? (y / max).toFixed(4) : "0");
    header?.classList.toggle("scrolled", y > 8);
    if (header && !nav?.classList.contains("open")) {
      if (y > 480 && y > lastY + 6) header.classList.add("hide");
      else if (y < lastY - 6 || y < 480) header.classList.remove("hide");
    }
    toTop?.classList.toggle("show", y > 700);
    stepLists.forEach((list) => {
      const items = [...list.children];
      const r = list.getBoundingClientRect();
      const horizontal = items.length > 1 && Math.abs(items[0].getBoundingClientRect().top - items[1].getBoundingClientRect().top) < 4;
      let p;
      if (horizontal) {
        p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (innerHeight * .45)));
        items.forEach((li, i) => li.classList.toggle("lit", p > 0 && p >= i / (items.length - 1) - .02));
      } else {
        const line = innerHeight * .7;
        p = Math.min(1, Math.max(0, (line - r.top) / r.height));
        items.forEach((li) => li.classList.toggle("lit", li.getBoundingClientRect().top < line));
      }
      list.style.setProperty("--p", p.toFixed(3));
    });
    lastY = y;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
})();
