const whatsappUrl = "https://wa.me/919217093330?text=Hi%20ARG%2C%20I%27m%20interested%20in%20a%20property%20consultation.";

const navigation = document.querySelector(".nav");
navigation.innerHTML = `
  <a href="#home">Home</a>
  <a href="#about">About</a>
  <a href="#services">Services</a>
  <a href="#areas">Areas We Serve</a>
  <a href="#gallery">Gallery</a>
  <a href="#testimonials">Testimonials</a>
  <a href="#faq">FAQ</a>
  <a class="nav-cta" href="#contact">Enquire Now <svg class="icon"><use href="#arrow"/></svg></a>`;

const hero = document.querySelector(".hero");
document.querySelector("h1").innerHTML = "Best <em>Real Estate Consultant</em><br>in Greater Noida West";
document.querySelector(".hero-copy > .eyebrow").textContent = "TRUSTED REAL ESTATE CONSULTANT · SINCE 2026";
document.querySelector(".hero-intro").textContent = "Asset Realty Group is a trusted real estate consultant helping you buy, sell and invest in residential and commercial property across Noida, Greater Noida, Ghaziabad and Delhi NCR — with verified listings and complete transparency.";
document.querySelector(".proof").innerHTML = `
  <span><svg class="icon"><use href="#check"/></svg> Local Market Experts</span>
  <span><svg class="icon"><use href="#check"/></svg> Verified Listings Only</span>
  <span><svg class="icon"><use href="#check"/></svg> End-to-End Support</span>`;
document.querySelector(".actions").innerHTML = `
  <a class="button copper" href="${whatsappUrl}" target="_blank" rel="noreferrer">Enquire on WhatsApp <svg class="icon"><use href="#wa"/></svg></a>
  <a class="text-link" href="#services">Explore Services <svg class="icon"><use href="#arrow"/></svg></a>`;
document.querySelector(".hero-visual img").alt = "Luxury residential property in Greater Noida West sold by ARG real estate consultant";
document.querySelector(".hero-visual .image-label").innerHTML = "<span>01 / 04</span><span>Homes, considered.</span>";
document.querySelector(".rail").innerHTML = `
  <div class="hero-stats">
    <div><strong>4+</strong><span>NCR Cities Served</span></div>
    <div><strong>100%</strong><span>Verified Deals</span></div>
    <div><strong>8</strong><span>Property Services</span></div>
  </div>`;

document.querySelector(".hero-grid").insertAdjacentHTML("beforeend", `
  <form class="property-search" id="property-search">
    <div class="search-tabs" role="group" aria-label="Choose property enquiry type">
      <button type="button" class="search-tab is-active" data-interest="Buy a Property" aria-pressed="true">Buy</button>
      <button type="button" class="search-tab" data-interest="Sell a Property" aria-pressed="false">Sell</button>
      <button type="button" class="search-tab" data-interest="Rent / Lease" aria-pressed="false">Rent</button>
      <button type="button" class="search-tab" data-interest="Invest in Property" aria-pressed="false">Invest</button>
    </div>
    <h2>Find Your Property</h2>
    <label for="search-type">Property Type</label>
    <select id="search-type" name="property-type"><option>Any Type</option><option>Residential</option><option>Commercial</option><option>Plots &amp; Land</option></select>
    <label for="search-location">Location</label>
    <select id="search-location" name="location"><option>Greater Noida West</option><option>Noida</option><option>Greater Noida</option><option>Ghaziabad</option><option>Delhi NCR</option></select>
    <label for="search-budget">Budget</label>
    <select id="search-budget" name="budget"><option>Any Budget</option><option>Under ₹50 lakh</option><option>₹50 lakh–₹1 crore</option><option>₹1 crore and above</option></select>
    <button class="button copper search-submit" type="submit">Find Property <svg class="icon"><use href="#arrow"/></svg></button>
  </form>`);
const propertyFinder = document.querySelector("#property-search");

document.querySelector(".quick").innerHTML = `
  <nav class="wrap category-strip" aria-label="Property services">
    <a class="category-link" href="#services"><svg class="icon"><use href="#home"/></svg><span>Residential Properties</span><small>Buy or sell</small></a>
    <a class="category-link" href="#services"><svg class="icon"><use href="#building"/></svg><span>Commercial Property</span><small>Offices, retail &amp; shops</small></a>
    <a class="category-link" href="#services"><svg class="icon"><use href="#file"/></svg><span>Plots &amp; Land</span><small>Residential &amp; investment</small></a>
    <a class="category-link" href="#services"><svg class="icon"><use href="#trend"/></svg><span>Investment Consultancy</span><small>Market-led guidance</small></a>
    <a class="category-link" href="#services"><svg class="icon"><use href="#key"/></svg><span>Home Loan Assistance</span><small>Support with financing</small></a>
    <a class="category-link" href="#services"><svg class="icon"><use href="#shield"/></svg><span>Registry &amp; Documents</span><small>Support through closing</small></a>
  </nav>`;

const about = document.querySelector("#about");
about.querySelector(".intro-visual img").alt = "ARG real estate consultant handing over keys to a happy property buyer in Greater Noida West";
about.querySelector(".caption").innerHTML = `
  <span class="story-caption__copy"><small>2026 · TRUSTED SINCE</small><strong>Your property, our priority.</strong></span>
  <a href="#contact" aria-label="Talk to our experts"><svg class="icon"><use href="#arrow"/></svg></a>`;
about.querySelector(".intro-copy > .eyebrow").textContent = "ABOUT ASSET REALTY GROUP";
about.querySelector(".intro-copy h2").textContent = "Your Trusted Real Estate Consultant in Greater Noida West";
const aboutParagraphs = about.querySelectorAll(".intro-copy > p:not(.eyebrow)");
aboutParagraphs[0].textContent = "Asset Realty Group (ARG) is a trusted real estate consultancy based in Greater Noida West, offering complete solutions for buying, selling, renting and managing property. We specialise in both residential and commercial real estate — ensuring every client receives honest advice, market-driven pricing and smooth, transparent transactions.";
aboutParagraphs[1].textContent = "Whether you are a first-time home buyer, a property owner looking to sell quickly, or an investor chasing strong returns, our real estate consultant team guides you at every step — from the first site visit to final registry.";
aboutParagraphs[1].insertAdjacentHTML("afterend", `<p>Greater Noida West has become one of the most active property corridors in Delhi NCR, with fast-growing residential societies, improving connectivity and strong rental demand. Our on-ground knowledge of these sectors — plus Noida, Greater Noida and Ghaziabad — means you get the right property at the right price, backed by a real estate consultant who genuinely understands the local market.</p>`);
about.querySelector(".values").innerHTML = `
  <li><svg class="icon"><use href="#check"/></svg><span><strong>Honest, market-driven pricing</strong> — no inflated numbers, no false promises.</span></li>
  <li><svg class="icon"><use href="#check"/></svg><span><strong>Verified, legally-clear listings</strong> checked for ownership and documentation.</span></li>
  <li><svg class="icon"><use href="#check"/></svg><span><strong>Complete support</strong> — home loans, documentation and registry assistance.</span></li>`;
about.querySelector(".dark-link").textContent = "Talk to Our Experts";
about.querySelector(".dark-link").insertAdjacentHTML("beforeend", ` <svg class="icon"><use href="#arrow"/></svg>`);

const reasons = [
  ["Local Market Expertise", "Deep knowledge of Greater Noida West, Noida and Ghaziabad property trends, sectors and pricing.", "pin"],
  ["Verified Listings Only", "Every property is checked for clear ownership, correct pricing and full legal clarity before we show it.", "shield"],
  ["Transparent Process", "No hidden charges and no false promises — only honest guidance from your real estate consultant.", "check"],
  ["Residential & Commercial", "Complete solutions for homeowners, investors and business owners under one trusted roof.", "building"],
  ["End-to-End Support", "From the first site visit to final registration and loan approval, we handle every step for you.", "file"],
  ["Client-First Approach", "Your goals, budget and timelines always come first — that is our promise at ARG.", "heart"],
];
document.querySelector(".reasons").innerHTML = `
  <div class="wrap trust-band">
    <div class="trust-heading"><div><p class="eyebrow light">WHY CHOOSE ARG</p><h2>Why Choose Our Real Estate Consultant Team</h2></div><p>Six reasons clients across Greater Noida West and Delhi NCR trust Asset Realty Group with their biggest property decisions.</p></div>
    <div class="trust-grid">${reasons.map(([title, description, icon], index) => `
      <article class="trust-point"><span class="trust-number">0${index + 1}</span><svg class="icon"><use href="#${icon}"/></svg><h3>${title}</h3><p>${description}</p></article>`).join("")}
    </div>
  </div>`;

const journey = [
  ["Understand Your Need", "We start by understanding your budget, preferred location, timeline and whether you're looking at residential, commercial or investment property. This helps us shortlist only what truly fits you across Greater Noida West, Noida and Ghaziabad."],
  ["Shortlist & Site Visits", "Our real estate consultant team hand-picks verified listings with clear ownership and pricing, then arranges convenient site visits so you can see each property in person before deciding — no pressure, no false promises."],
  ["Negotiate & Finalise", "We negotiate on your behalf to secure the best market-driven price, coordinate home loan approvals from leading banks, and make sure every commercial term is fair and transparent before you commit."],
  ["Documentation & Handover", "From agreement drafting to registry and final handover, we manage the complete paperwork so your deal closes smoothly. Even after the sale, our property management support stays available for owners."],
  ["Investment Guidance", "For investors, we back every recommendation with real market analysis — expected rental yield, appreciation trends and demand in fast-growing corridors like Greater Noida West and the wider Delhi NCR belt."],
  ["Long-Term Relationship", "We don't disappear after a deal. Many ARG clients return for their next purchase, rental or resale because they know they'll get the same honest advice from a real estate consultant who puts their interests first."],
];
const journeySection = document.querySelector(".journey");
journeySection.querySelector(".section-heading .eyebrow").textContent = "HOW WE WORK";
journeySection.querySelector(".section-heading h2").textContent = "A Simple, Transparent Property Journey";
journeySection.querySelector(".section-heading > p:last-child").textContent = "Buying or selling property is one of life's biggest decisions. As your real estate consultant in Greater Noida West, we keep every step clear, guided and stress-free — from your first call to the final registry.";
journeySection.querySelector(".steps").innerHTML = journey.map(([title, description], index) => `
  <li class="step"><span class="step-no">0${index + 1}</span><h3>${title}</h3><p>${description}</p></li>`).join("");

const locationSection = document.querySelector(".locations");
locationSection.id = "areas";
const serviceAreas = [
  { name: "Greater Noida West", coordinates: [28.5855, 77.4355] },
  { name: "Noida", coordinates: [28.5355, 77.391] },
  { name: "Greater Noida", coordinates: [28.4744, 77.504] },
  { name: "Ghaziabad", coordinates: [28.6692, 77.4538] },
  { name: "Delhi NCR", coordinates: [28.6139, 77.209] },
  { name: "Gaur City", coordinates: [28.6086, 77.4358] },
  { name: "Bisrakh", coordinates: [28.5907, 77.4204] },
  { name: "Sector 1-16 GN West", coordinates: [28.575, 77.438] },
  { name: "Techzone 4", coordinates: [28.6167, 77.431] },
  { name: "Pratap Vihar", coordinates: [28.6553, 77.413] },
];
locationSection.querySelector(".location-inner").innerHTML = `
  <div class="location-copy">
    <p class="eyebrow">AREAS WE SERVE</p><h2>Real Estate Consultant Across Delhi NCR</h2>
    <p>ARG operates as a dedicated real estate consultant across the NCR property belt, covering these key micro-markets. Wherever your requirement is, our team brings verified listings, local pricing insight and complete documentation support right to your doorstep.</p>
    <div class="places" aria-label="Select a location to view it on the map">${serviceAreas.map((area, index) => `<button type="button" data-area-index="${index}" aria-pressed="false"><span>${String(index + 1).padStart(2, "0")}</span>${area.name}</button>`).join("")}</div>
  </div>
  <div class="location-map"><div class="map-canvas" id="area-map" role="application" aria-label="Map with markers for every Asset Realty Group service area"><p class="map-fallback">Loading service-area map…</p></div><a href="https://www.openstreetmap.org/?mlat=28.57&amp;mlon=77.43#map=10/28.57/77.36" target="_blank" rel="noreferrer">Explore the areas we serve <svg class="icon"><use href="#arrow"/></svg></a></div>`;

const mapContainer = document.querySelector("#area-map");
if (window.L) {
  mapContainer.innerHTML = "";
  const areaMap = L.map(mapContainer, { scrollWheelZoom: false });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  }).addTo(areaMap);

  const areaMarkers = serviceAreas.map((area, index) => {
    const icon = L.divIcon({
      className: "area-marker-shell",
      html: `<span class="area-marker"><span>${String(index + 1).padStart(2, "0")}</span></span>`,
      iconSize: [32, 38],
      iconAnchor: [16, 34],
      popupAnchor: [0, -30],
    });
    const marker = L.marker(area.coordinates, { title: area.name, alt: area.name, icon }).addTo(areaMap);
    marker.bindPopup(`<strong>${area.name}</strong>`);
    marker.on("click", () => {
      document.querySelectorAll("[data-area-index]").forEach((button, buttonIndex) => {
        button.setAttribute("aria-pressed", String(buttonIndex === index));
      });
    });
    return marker;
  });

  areaMap.fitBounds(L.latLngBounds(serviceAreas.map((area) => area.coordinates)), { padding: [25, 25], maxZoom: 10 });
  document.querySelectorAll("[data-area-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.areaIndex);
      document.querySelectorAll("[data-area-index]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      areaMap.flyTo(serviceAreas[index].coordinates, 13, { duration: 0.6 });
      areaMarkers[index].openPopup();
    });
  });
} else {
  mapContainer.querySelector(".map-fallback").textContent = "Map unavailable. Use the location list or open the map directly.";
}

const gallerySection = document.querySelector("#gallery");
gallerySection.querySelector(".section-heading .eyebrow").textContent = "OUR GALLERY";
gallerySection.querySelector(".section-heading h2").textContent = "Properties & Projects We Deal In";
gallerySection.querySelector(".section-heading > p").textContent = "A glimpse of the premium residential and commercial property our real estate consultant team handles across Greater Noida West and NCR.";
const galleryItems = [
  ["photo-1545324418-cc1a3fa10c00", "Luxury residential apartment building for sale in Greater Noida West through ARG", "Luxury residential apartments"],
  ["photo-1502672260266-1c1ef2d93688", "Modern furnished living room in a residential property listed by Asset Realty Group", "Modern living spaces"],
  ["photo-1486406146926-c627a92ad1ab", "Commercial office building in Noida offered by ARG real estate consultant", "Commercial spaces"],
  ["photo-1613490493576-7fde63acd811", "Premium independent house and villa property in Delhi NCR from Asset Realty Group", "Premium villas & houses"],
  ["photo-1497366811353-6870744d04b2", "Prime commercial office interior available for lease in Greater Noida West", "Prime office interiors"],
  ["photo-1560518883-ce09059eeffa", "ARG real estate consultant conducting a property site visit for a client in NCR", "Site visits with ARG"],
];
gallerySection.querySelector(".gallery-grid").innerHTML = galleryItems.map(([photo, alt, title], index) => `
  <figure class="gallery-item">
    <img src="https://images.unsplash.com/${photo}?auto=format&amp;fit=crop&amp;w=${index === 0 || index === 4 ? 1100 : 800}&amp;q=85" alt="${alt}" loading="lazy">
    <figcaption><span>0${index + 1}</span>${title}</figcaption>
  </figure>`).join("");
gallerySection.querySelector(".gallery-note").textContent = "A glimpse of the residential and commercial properties our team works with across Greater Noida West and NCR.";

const testimonials = document.querySelector(".testimonials");
testimonials.id = "testimonials";
testimonials.previousElementSibling.querySelector(".eyebrow").textContent = "CLIENT REVIEWS";
testimonials.previousElementSibling.querySelector("h2").textContent = "What Our Clients Say";
testimonials.previousElementSibling.insertAdjacentHTML("beforeend", `<p class="section-summary">Real feedback from buyers, sellers and investors who trusted our real estate consultant team.</p>`);
const reviews = [
  ["ARG helped me buy my first flat in Greater Noida West within budget. Everything from site visit to registry was smooth and completely transparent.", "Rahul Sharma", "Home Buyer · Greater Noida West", "R"],
  ["Sold my property faster than I expected. The team knew the local market perfectly and got me a fair, market-driven price without any hidden charges.", "Priya Verma", "Property Seller · Noida", "P"],
  ["As an investor I value honest advice. ARG backed every suggestion with real market data and clear documentation. Truly a trustworthy real estate consultant.", "Amit Gupta", "Investor · Ghaziabad", "A"],
];
testimonials.innerHTML = reviews.map(([quote, name, role, initial]) => `
  <figure class="quote"><div class="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>${quote}</blockquote><figcaption><span class="initial">${initial}</span><span><strong>${name}</strong><small>${role}</small></span></figcaption></figure>`).join("");

const faqSection = document.querySelector("#faq");
faqSection.querySelector(".faq-intro .eyebrow").textContent = "FAQ";
faqSection.querySelector(".faq-intro h2").textContent = "Frequently Asked Questions";
faqSection.querySelector(".faq-intro > p").textContent = "Quick answers about working with a real estate consultant in Greater Noida West.";
faqSection.querySelector(".faq-intro .text-link").textContent = "Talk to our team";
faqSection.querySelector(".faq-intro .text-link").insertAdjacentHTML("beforeend", ` <svg class="icon"><use href="#arrow"/></svg>`);
const questions = [
  ["Which areas does Asset Realty Group serve as a real estate consultant?", "As a real estate consultant in Greater Noida West, ARG serves the entire NCR belt — Greater Noida West, Noida, Greater Noida, Ghaziabad and wider Delhi NCR. We handle residential flats, plots, and commercial property across all these micro-markets."],
  ["Are the property listings at ARG verified?", "Yes. Every property we recommend is checked for clear ownership, correct pricing and legal clarity before we show it to you. Our real estate consultant team never lists a property with title or documentation issues."],
  ["Does Asset Realty Group help with home loans and registry?", "Absolutely. Beyond finding property, we assist with home loan approvals from leading banks, agreement drafting, registry and complete documentation support so your deal closes smoothly."],
  ["How does ARG help property owners sell faster?", "We provide a professional market-based valuation, list your property to a strong buyer network across Greater Noida and Noida, arrange verified site visits, and manage negotiation and paperwork so owners sell quickly at the best value."],
  ["Is a site visit free with Asset Realty Group?", "Yes, site visits and the first consultation are completely free. Just call or WhatsApp us at +91-9217093330 and our real estate consultant will arrange a convenient visit across Greater Noida West and NCR."],
];
faqSection.querySelector(".faq-list").innerHTML = questions.map(([question, answer]) => `
  <details class="faq-item"><summary>${question}<span class="plus" aria-hidden="true"></span></summary><p>${answer}</p></details>`).join("");

const contact = document.querySelector("#contact");
contact.querySelector(".contact-copy > .eyebrow").textContent = "GET IN TOUCH";
contact.querySelector(".contact-copy h2").textContent = "Let's Find Your Next Property";
contact.querySelector(".contact-copy > p").textContent = "Talk to a trusted real estate consultant in Greater Noida West. Call, WhatsApp or drop your details — we'll get back to you fast with the right options.";
contact.querySelectorAll(".detail small").forEach((label, index) => {
  label.textContent = ["CALL / WHATSAPP", "EMAIL", "OFFICE ADDRESS", "WORKING HOURS"][index];
});
contact.querySelector(".detail:nth-child(3) strong").innerHTML = "Office No. T-39B, 3rd Floor, Galaxy Blue Sapphire Plaza,<br>Greater Noida West (U.P.) 201306";
contact.querySelector(".form-head .eyebrow").textContent = "SEND AN ENQUIRY";
contact.querySelector(".form-head h3").textContent = "Tell us what you are looking for.";
contact.querySelector(".form-head p").textContent = "Fill the form — it opens WhatsApp with your details pre-filled.";
contact.querySelector("label[for='name']").textContent = "Your Name";
contact.querySelector("#name").placeholder = "Enter your name";
contact.querySelector("label[for='phone-number']").textContent = "Phone Number";
contact.querySelector("#phone-number").placeholder = "Enter your mobile number";
contact.querySelector("label[for='interest']").textContent = "I want to";
contact.querySelector("#interest").innerHTML = `
  <option>Buy a Property</option><option>Sell a Property</option><option>Rent / Lease</option>
  <option>Invest in Property</option><option>Home Loan Assistance</option><option>Other Enquiry</option>`;
contact.querySelector("label[for='location']").innerHTML = "Preferred Location <span>(optional)</span>";
contact.querySelector("label[for='message']").textContent = "Message";
contact.querySelector("#message").placeholder = "Tell us your budget, location or requirement";
contact.querySelector(".submit").innerHTML = "Send on WhatsApp <svg class=\"icon\"><use href=\"#wa\"/></svg>";
contact.querySelector(".contact-grid").append(contact.querySelector("#enquiry"));

document.querySelector(".footer-brand > p").textContent = "Trusted real estate consultant in Greater Noida West for buying, selling, renting and managing residential and commercial property across Noida, Greater Noida, Ghaziabad and Delhi NCR.";
document.querySelector(".whatsapp-link").insertAdjacentHTML("afterend", `
  <div class="social-links" aria-label="Social media">
    <a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">◎</a>
    <a href="https://wa.me/919217093330" aria-label="WhatsApp"><svg class="icon"><use href="#wa"/></svg></a>
  </div>`);
document.querySelectorAll(".footer-col")[0].innerHTML = `
  <h2>QUICK LINKS</h2><a href="#home">Home</a><a href="#about">About Us</a><a href="#services">Services</a><a href="#gallery">Gallery</a><a href="#faq">FAQ</a><a href="#contact">Contact Us</a>`;
document.querySelectorAll(".footer-col")[1].innerHTML = `
  <h2>SERVICES</h2><a href="#services">Buy Property</a><a href="#services">Sell Property</a><a href="#services">Commercial Property</a><a href="#services">Plots &amp; Land</a><a href="#services">Investment Consultancy</a><a href="#services">Home Loan Assistance</a>`;
document.querySelectorAll(".footer-col")[2].innerHTML = `
  <h2>CONTACT</h2><a href="tel:+919217093330">+91-9217093330</a><a href="mailto:info@assetrealtygroup.in">info@assetrealtygroup.in</a><span>Office No. T-39B, 3rd Floor, Galaxy Blue Sapphire Plaza, Greater Noida West (U.P.) 201306</span>`;
document.querySelector(".footer-bottom").innerHTML = `
  <span>© 2026 Asset Realty Group. All Rights Reserved.</span>
  <a href="#top">Back to top <svg class="icon"><use href="#arrow-up"/></svg></a>`;

document.querySelectorAll(".search-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".search-tab").forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    document.querySelector("#interest").value = tab.dataset.interest;
  });
});

propertyFinder.addEventListener("submit", (event) => {
  event.preventDefault();
  const search = new FormData(propertyFinder);
  const enquiry = document.querySelector("#enquiry");
  const propertyType = search.get("property-type");
  const budget = search.get("budget");
  enquiry.querySelector("#location").value = search.get("location");
  enquiry.querySelector("#message").value = [
    propertyType !== "Any Type" ? `Property type: ${propertyType}` : "",
    budget !== "Any Budget" ? `Budget: ${budget}` : "",
  ].filter(Boolean).join("\n");
  enquiry.scrollIntoView({ behavior: "smooth", block: "start" });
  enquiry.querySelector("#name").focus({ preventScroll: true });
});

const floatingWhatsApp = document.querySelector(".float-wa");
new IntersectionObserver(([entry]) => {
  floatingWhatsApp.classList.toggle("is-hidden", entry.isIntersecting);
}).observe(hero);