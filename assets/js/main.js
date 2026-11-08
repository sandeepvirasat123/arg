/* Asset Realty Group — shared site behaviour */
(() => {
  const WA_NUMBER = "919217093330";
    const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const openWhatsApp = (text) => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    
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
  // Images already rendered by the server may finish before this script runs
  $$(".card-media img").forEach((img) => { if (img.complete) img.classList.add("loaded"); });
  // Property photo links expire. If one fails, show the "Photos on request" tile instead of a broken image.
  const photoFallback = (img) => {
    const media = img.closest(".card-media");
    if (!media || media.classList.contains("no-photo")) return;
    media.classList.add("no-photo");
    media.innerHTML = `<span class="ph-tile"><svg class="icon" aria-hidden="true"><use href="#building"/></svg><small>Photos on request</small></span>`;
  };
  document.addEventListener("error", (e) => {
    if (e.target.tagName !== "IMG") return;
    if (e.target.closest(".card-media")) photoFallback(e.target);
    if (e.target.closest(".gallery-thumbs")) e.target.closest("li").hidden = true;
  }, true);
  $$(".card-media img").forEach((img) => { if (img.complete && !img.naturalWidth) photoFallback(img); });

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

  /* ---------- Home: latest listings, from the site's own cached feed ---------- */
  const featured = $("#featured-grid");
  if (featured) {
    const more = $("#featured-more");
    let rows = [];
    const render = (bhk) => {
      const list = bhk === "all" ? rows : rows.filter((p) => (bhk === "4" ? p.bhk >= 4 : Math.floor(p.bhk) === Number(bhk)));
      featured.innerHTML = list.length
        ? list.slice(0, 4).map((p) => p.html).join("")
        : `<div class="empty"><strong>No ${bhk === "4" ? "4+" : bhk} BHK homes listed right now</strong>Tell us what you need and we will look for options for you.<br><br><a class="btn btn-copper btn-sm" href="contact">Share your requirement</a></div>`;
      syncHearts(featured);
      if (more) more.href = bhk === "all" ? "buy" : `buy?bhk=${bhk}`;
    };
    $$("[data-featured]").forEach((tab) => tab.addEventListener("click", () => {
      $$("[data-featured]").forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      render(tab.dataset.featured);
    }));
    fetch("api/inventory.php", { headers: { Accept: "application/json" } })
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) throw new Error("unavailable");
        rows = data.rows;
        render("all");
      })
      .catch(() => {
        featured.innerHTML = `<div class="empty"><strong>We could not load properties just now</strong>Please see the Buy page, or call +91 92170 93330.<br><br><a class="btn btn-copper btn-sm" href="buy">Go to the Buy page</a></div>`;
      });
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
      if (intent === "sell") { e.preventDefault(); location.href = "sell"; }
    });
  }

  /* ---------- Buy page: filters run on the server, this keeps URLs tidy and applies changes at once ---------- */
  const filterForm = $("#filters");
  if (filterForm) {
    const go = () => {
      const params = new URLSearchParams();
      new FormData(filterForm).forEach((value, key) => { if (value) params.set(key, value); });
      const query = params.toString();
      location.href = `buy${query ? `?${query}` : ""}`;
    };
    filterForm.addEventListener("submit", (e) => { e.preventDefault(); go(); });
    filterForm.addEventListener("change", go);
    $("#sort")?.addEventListener("change", go);
    syncHearts(document);
  }
  if ($(".property-page")) syncHearts(document);

  /* ---------- Property page: photo gallery ---------- */
  const galleryMain = $("#gallery-main");
  if (galleryMain) {
    const thumbs = $$("[data-gallery-thumb]");
    thumbs.forEach((thumb, i) => thumb.addEventListener("click", (e) => {
      e.preventDefault();
      galleryMain.src = thumb.href;
      galleryMain.alt = galleryMain.alt.replace(/photo \d+$/, `photo ${i + 1}`);
      thumbs.forEach((t) => (t === thumb ? t.setAttribute("aria-current", "true") : t.removeAttribute("aria-current")));
    }));
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

  /* ---------- Channel Partner programme page ---------- */
  // Analytics: events go to window.dataLayer only, and never include form values.
  // No analytics tag is loaded by this site; any tag added later must respect visitor consent.
  const track = (event, details = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...details });
  };
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track]");
    if (el) track(el.dataset.track, { location: el.dataset.trackLoc || "page" });
  });

  // Section navigation: highlight the section being read
  const subnavLinks = $$(".cp-subnav a[href^='#']");
  if (subnavLinks.length && "IntersectionObserver" in window) {
    const setCurrent = (id) => subnavLinks.forEach((a) => {
      const on = a.getAttribute("href") === `#${id}`;
      if (on) {
        a.setAttribute("aria-current", "true");
        const list = a.closest(".cp-subnav-links");
        list?.scrollTo({ left: a.offsetLeft - 16 }); // keep the current link visible on phones, without moving the page
      } else a.removeAttribute("aria-current");
    });
    const spy = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) setCurrent(entry.target.id);
    }), { rootMargin: "-30% 0px -65% 0px" });
    subnavLinks.forEach((a) => { const target = $(a.getAttribute("href")); if (target) spy.observe(target); });
    const top = $(".cp-hero");
    if (top) new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setCurrent(""); }).observe(top);
  }

  // "See how it works" tabs (arrow keys move between tabs, as screen reader users expect)
  const journeyTabs = $$("[data-journey-tab]");
  if (journeyTabs.length) {
    const select = (tab, focus) => {
      journeyTabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        $(`#${t.getAttribute("aria-controls")}`).hidden = !on;
      });
      if (focus) tab.focus();
    };
    journeyTabs.forEach((tab, i) => {
      tab.addEventListener("click", () => { select(tab); track("cp_journey_tab", { tab: tab.dataset.journeyTab }); });
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const step = e.key === "ArrowRight" ? 1 : -1;
        select(journeyTabs[(i + step + journeyTabs.length) % journeyTabs.length], true);
      });
    });
    select(journeyTabs[0]);
  }

  $$(".cp-page .faq summary").forEach((summary, i) => summary.addEventListener("click", () => {
    if (!summary.parentElement.open) track("cp_faq_open", { question: i + 1 });
  }));

  // The one Channel Partner enquiry form
  const cpForm = $("#cp-form");
  if (cpForm) {
    const alertBox = $("#cp-alert");
    const submitBtn = $("button[type=submit]", cpForm);
    const firmField = $("#cp-firm-field");
    const field = (name) => cpForm.elements[name];
    const errorEl = (name) => $(`#cp-err-${name}`);
    let firstTouch = 0;

    const setError = (name, message) => {
      const el = errorEl(name);
      el.textContent = message || "";
      el.hidden = !message;
      const control = field(name);
      (control instanceof RadioNodeList ? [...control] : [control]).forEach((c) => {
        if (message) c.setAttribute("aria-invalid", "true"); else c.removeAttribute("aria-invalid");
      });
    };
    const mobileDigits = (value) => value.replace(/\D/g, "").replace(/^(?:91|0)(?=\d{10}$)/, "");
    const rules = {
      full_name: () => (/^[\p{L}\p{M} .'-]{2,}$/u.test(field("full_name").value.trim()) ? "" : "Please enter your full name."),
      mobile: () => (/^[6-9]\d{9}$/.test(mobileDigits(field("mobile").value)) ? "" : "Please enter a valid 10-digit Indian mobile number."),
      city_area: () => (field("city_area").value.trim().length >= 2 ? "" : "Please enter your city or area."),
      email: () => { const v = field("email").value.trim(); return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address, or leave it blank."; },
      interest: () => (field("interest").value ? "" : "Please choose how you would like to collaborate."),
      consent: () => (field("consent").checked ? "" : "Please confirm that ARG may contact you about this enquiry."),
    };
    const validate = () => {
      let first = null;
      Object.entries(rules).forEach(([name, rule]) => {
        const message = rule();
        setError(name, message);
        if (message) {
          track("cp_form_validation_error", { field: name });
          first = first || name;
        }
      });
      if (first) {
        const control = field(first);
        (control instanceof RadioNodeList ? control[0] : control).focus();
      }
      return !first;
    };

    // Re-check a field when the visitor leaves it, once it has been flagged or filled in
    ["full_name", "mobile", "city_area", "email"].forEach((name) => field(name).addEventListener("blur", () => {
      if (field(name).value || !errorEl(name).hidden) setError(name, rules[name]());
    }));
    cpForm.addEventListener("change", (e) => {
      if (e.target.name === "interest" || e.target.name === "consent") setError(e.target.name, rules[e.target.name]());
    });
    cpForm.addEventListener("focusin", () => {
      if (!firstTouch) { firstTouch = performance.now(); track("cp_form_start"); }
    });

    const syncFirm = () => { firmField.hidden = field("applicant_type").value !== "Firm"; };
    $$("input[name=applicant_type]", cpForm).forEach((el) => el.addEventListener("change", syncFirm));
    syncFirm();

    // Activity cards and links can pre-select the interest. It is the same form either way.
    const preselect = (value) => {
      const radio = $(`input[name=interest][value="${value}"]`, cpForm);
      if (radio) { radio.checked = true; setError("interest", ""); }
    };
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-interest]");
      if (link) preselect(link.dataset.interest);
    });
    const query = new URLSearchParams(location.search);
    if (query.get("interest")) preselect(query.get("interest"));

    const whatsappMessage = () => [
      "Hi ARG, I'd like to become an ARG Channel Partner.",
      `Name: ${field("full_name").value.trim()}`,
      `Mobile: ${field("mobile").value.trim()}`,
      `City / area: ${field("city_area").value.trim()}`,
      `Applying as: ${field("applicant_type").value}`,
      field("interest").value ? `Interested in: ${$(`input[name=interest]:checked + label strong`, cpForm).textContent}` : "",
    ].filter(Boolean).join("\n");
    const showAlert = (message) => {
      $("[data-alert-text]", alertBox).textContent = message;
      $("a", alertBox).href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(whatsappMessage())}`;
      alertBox.hidden = false;
      alertBox.focus();
    };

    cpForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (submitBtn.disabled) return;
      alertBox.hidden = true;
      if (!validate()) return;

      const data = new FormData(cpForm);
      data.set("started", Math.round(performance.now() - firstTouch));
      data.set("src_page", location.pathname);
      ["utm_source", "utm_medium", "utm_campaign"].forEach((key) => { if (query.get(key)) data.set(`src_${key}`, query.get(key)); });

      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
      $("span", submitBtn).textContent = "Sending your enquiry…";
      track("cp_form_submit_attempt", { interest: field("interest").value });
      const timeout = new AbortController();
      const timer = setTimeout(() => timeout.abort(), 15000);
      try {
        const res = await fetch(cpForm.action, { method: "POST", body: data, headers: { Accept: "application/json" }, signal: timeout.signal });
        const body = await res.json();
        if (body.ok) {
          track("cp_form_submit_success", { interest: field("interest").value });
          cpForm.hidden = true;
          const success = $("#cp-success");
          success.hidden = false;
          success.focus();
          return;
        }
        if (body.errors) {
          Object.entries(body.errors).forEach(([name, message]) => { if (errorEl(name)) setError(name, message); });
          track("cp_form_submit_error", { reason: "validation" });
          showAlert("Please check the highlighted details and try again.");
        } else {
          track("cp_form_submit_error", { reason: `http_${res.status}` });
          showAlert(body.message || "We could not send your enquiry just now. Your details are still here, so you can try again or send them on WhatsApp.");
        }
      } catch {
        track("cp_form_submit_error", { reason: "network" });
        showAlert("We could not send your enquiry just now. Your details are still here, so you can try again or send them on WhatsApp.");
      } finally {
        clearTimeout(timer);
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
        $("span", submitBtn).textContent = "Submit my CP enquiry";
      }
    });
  }

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
