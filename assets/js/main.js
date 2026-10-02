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
  const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

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
  ];

  const cardHTML = (p) => {
    const specs = [
      p.bhk ? `<span><svg class="icon"><use href="#bed"/></svg>${p.bhk} BHK</span>` : "",
      p.baths && p.type === "Residential" ? `<span><svg class="icon"><use href="#bath"/></svg>${p.baths} Bath</span>` : "",
      `<span><svg class="icon"><use href="#area"/></svg>${p.area.toLocaleString("en-IN")} sq.ft</span>`,
    ].join("");
    const msg = `Hi ARG, I'd like to know more about ${p.title} in ${p.sub}, ${p.loc} (Ref ${p.id}, ${priceLabel(p.price)}). Can we schedule a site visit?`;
    return `<article class="card">
      <div class="card-media">
        <img src="${IMG(p.img, 700)}" alt="${p.title} in ${p.sub}, ${p.loc}" width="700" height="525" loading="lazy">
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
  });

  /* ---------- Home: featured listings with tabs ---------- */
  const featured = $("#featured-grid");
  if (featured) {
    const render = (type) => {
      featured.innerHTML = LISTINGS.filter((p) => p.type === type).slice(0, 4).map(cardHTML).join("");
      syncHearts(featured);
    };
    $$("[data-featured]").forEach((tab) => tab.addEventListener("click", () => {
      $$("[data-featured]").forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      render(tab.dataset.featured);
    }));
    render("Residential");
  }

  /* ---------- Home: hero search tabs ---------- */
  const heroSearch = $("#hero-search");
  if (heroSearch) {
    const intentInput = $("input[name=intent]", heroSearch);
    $$(".search-tab", heroSearch).forEach((tab) => tab.addEventListener("click", () => {
      $$(".search-tab", heroSearch).forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      intentInput.value = tab.dataset.intent;
      $("button[type=submit] span", heroSearch).textContent = tab.dataset.cta;
    }));
    heroSearch.addEventListener("submit", (e) => {
      const intent = intentInput.value;
      if (intent === "sell") { e.preventDefault(); location.href = "sell.html"; return; }
      if (intent === "partner") { e.preventDefault(); location.href = "partner.html"; }
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
        `<div class="empty"><strong>No matching homes in our current shortlist</strong>Tell us what you need and we'll search off-market options for you.<br><br><a class="btn btn-copper btn-sm" href="contact.html">Share your requirement</a></div>`;
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
})();
