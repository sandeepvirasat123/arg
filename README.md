# Asset Realty Group website

Static multi-page website for Asset Realty Group (ARG), Greater Noida West. ARG offers three services: **Buy**, **Sell** and **Partner**. No build step: plain HTML, one stylesheet and one script, plus a small PHP layer for live property pages and the Channel Partner form. Hosting must run PHP.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero search (Buy / Sell / Partner), service cards, latest live listings, verification checklist, process, areas, partner & valuation teasers, reviews, FAQs |
| `buy.php` | Live property listings, rendered on the server, with location, BHK, budget and sort filters. Address: `/buy` |
| `property.php` | Property detail page. Address: `/property/3-bhk-apartment-for-sale-in-coco-country-1-greater-noida-west-inv-000085` |
| `sitemap.php` | Sitemap with every live property. Address: `/sitemap.xml` |
| `sell.html` | 3-step free valuation form, seller benefits, process, comparison table, FAQs |
| `partner.html` | The one ARG Channel Partner (CP) programme page, with the one CP enquiry form |
| `about.html` | Story, values, services |
| `contact.html` | Contact details, enquiry form, office map |

Shared assets:

- `assets/css/style.css` — design tokens and all styles (brand palette: teal `#26626A`, gold `#BF9855`, ink `#233238`, surface `#F4F7F7`, with a deeper gold `#8a6d36` for small text on light backgrounds)
- `assets/js/main.js` — mobile menu, scroll reveal, hero search, listings and filters, valuation stepper, forms → WhatsApp

## Editing content

- **Listings:** these come from the inventory API, so change them in the inventory system. The site updates within about 5 minutes.
- **Phone / WhatsApp number:** `WA_NUMBER` in `main.js`, plus the `tel:` and `wa.me` links in each HTML file's header and footer.
- **Images:** property photos come from the API. Other page images load from Unsplash; replace them with your own when available.

Buy, Sell and Contact forms open WhatsApp with the enquiry pre-filled. The Channel Partner form posts to `api/cp-enquiry.php`.

## Channel Partner enquiries

There is one programme, one form and one lead type (`Website CP Enquiry`). Do not add separate Seller CP or Buyer CP pages or forms.

- **Setup:** copy `api/config.example.php` to `api/config.php` on the server and fill it in. PHP is required.
- **Where leads go:** saved to `arg_private/cp_enquiries/enquiries.jsonl` outside the web root, then emailed to the notify address, then sent to the CRM webhook if one is set.
- **Delivery problems:** check `delivery.log` in the same folder. A lead is saved even if email or the CRM fails.

Open approvals and the go-live checklist are in `ARG_PARTNER_WEBSITE_PROGRESS.md`.

## Live inventory

`includes/inventory.php` fetches `https://backend.propertyplusrealtors.com/public/inventory` on the server. The API does not allow browser calls from this domain, and server rendering is better for search engines.

- **Caching:** the list is cached for 5 minutes and details for 10. If the API is down, the last good copy keeps showing.
- **Hidden listings:** a listing is not published when its area is outside 200 to 20,000 sq.ft, its price is outside ₹1,500 to ₹60,000 per sq.ft, or its BHK, society or city is missing. This keeps test or mistyped records off the site. Correct the record and it appears automatically. Limits can be changed in `api/config.php`.
- **Placeholder photos:** images from `picsum.photos` are ignored and the listing shows "Photos on request".
- **URLs:** the `inv-000085` at the end identifies the property. If a name changes, old addresses redirect to the new one.

## Clean URLs

Links use clean addresses such as `/buy`, `/sell` and `/partner` (no `.html`). The files on disk are still `buy.html` etc., so the web server must map one to the other:

- **Hostinger / Apache:** the included `.htaccess` does this, and permanently redirects old `.html` links to the clean address.
- **Netlify, Vercel (with `cleanUrls`), GitHub Pages, Cloudflare Pages:** supported natively.

## Running locally

Run `php -S localhost:8000 dev-router.php` in this folder and open http://localhost:8000. This needs PHP with the curl extension. Opening the HTML files by double-clicking will not work properly.
