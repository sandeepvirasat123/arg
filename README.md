# Asset Realty Group website

Static multi-page website for Asset Realty Group (ARG), Greater Noida West. ARG offers three services: **Buy**, **Sell** and **Partner**. No build step: plain HTML, one stylesheet and one script.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero search (Buy / Sell / Partner), service cards, featured listings, verification checklist, process, areas, partner & valuation teasers, reviews, FAQs |
| `buy.html` | Filterable property listings (location, type, BHK, budget, sort) with "book a site visit" on WhatsApp |
| `sell.html` | 3-step free valuation form, seller benefits, process, comparison table, FAQs |
| `partner.html` | Partner programme for brokers, channel partners, developers and referral partners, with application form |
| `about.html` | Story, values, services |
| `contact.html` | Contact details, enquiry form, office map |

Shared assets:

- `assets/css/style.css` — design tokens and all styles (palette: slate `#243441`, steel blue `#347fb0`, copper `#d97745`, paper `#eff5fa`)
- `assets/js/main.js` — mobile menu, scroll reveal, hero search, listings and filters, valuation stepper, forms → WhatsApp

## Editing content

- **Listings:** edit the `LISTINGS` array near the top of `assets/js/main.js`. Prices are in lakh (`115` = ₹1.15 Cr). Current entries are representative samples — replace them with real inventory.
- **Phone / WhatsApp number:** `WA_NUMBER` in `main.js`, plus the `tel:` and `wa.me` links in each HTML file's header and footer.
- **Images:** loaded from Unsplash. Replace with your own project photos when available.

All forms open WhatsApp with the enquiry pre-filled; nothing is sent to a server.

## Running locally

Open `index.html` in a browser, or serve the folder (e.g. `npx serve .`) to test links with query strings like `buy.html?loc=Noida`.
