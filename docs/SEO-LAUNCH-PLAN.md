# Amamaza SEO launch plan

## Positioning
Amamaza helps businesses in Rwanda create advertising creatives: social media posts, promotional flyers, short video ads, shop banners, and optional professional editing. The product supports Kinyarwanda and English. Avoid claims that a feature is live until it is actually available.

## Search intent and keyword clusters
These are starting hypotheses based on the current product pages, not measured search-volume data. Validate them with Search Console, Keyword Planner, and real customer language before prioritizing.

### English
- AI ad maker Rwanda
- advertising design Rwanda
- social media post design Rwanda
- business flyer design Rwanda
- promotional flyer maker Rwanda
- video ads for small businesses Rwanda
- shop banner design Rwanda
- affordable advertising for small businesses Rwanda
- Instagram post design Kigali
- restaurant advertising design Rwanda
- salon flyer design Rwanda
- hotel promotional video Rwanda

### Kinyarwanda
- gukora amatangazo y'ubucuruzi
- gukora flyer mu Kinyarwanda
- gukora video zamamaza
- gukora ibyapa by'amaduka
- kwamamaza ubucuruzi mu Rwanda
- amatangazo y'ubucuruzi mu Rwanda
- gukora post zo kwamamaza
- igiciro cyo gukora flyer
- uko kwamamaza iduka
- kwamamaza resitora mu Rwanda

Use natural phrases in headings and page copy. Do not repeat keyword lists mechanically or stuff every phrase into every page.

## Page targeting
| Page | Main intent | Content to strengthen |
|---|---|---|
| / | AI advertising for businesses in Rwanda | Explain who it helps, how it works, available formats, language support, and clear CTA |
| /services | Ad design services | Separate useful sections for video ads, social posts/flyers, shop banners and professional editing |
| /examples | Advertising examples and inspiration | Give each example a descriptive caption, business type, format, and genuinely useful context |
| /pricing | Ad design prices in Rwanda | Publish confirmed prices, what each price includes, payment availability, and FAQs |

## Important bilingual architecture
The current language switch changes the visible language on the same URL. That is not enough to provide reliably indexable English and Kinyarwanda versions. Next phase: create distinct routes such as /rw/... and /en/... with fully translated primary content, self-referencing canonical URLs, reciprocal hreflang tags (rw, en, x-default), and language-aware internal links. Do not add hreflang until each alternate URL exists and contains its own language.

## Technical foundation now
- XML sitemap includes only the public marketing pages.
- robots.txt points crawlers to the sitemap.
- Public pages have descriptive titles, snippets, Open Graph metadata, and canonical URLs.
- Studio pages are marked noindex; keep customer/private utility screens out of search results.
- Google verification file remains under public/ so it is served at the domain root.

## Content and authority roadmap
1. Publish genuinely helpful landing pages for individual services only when each page has unique detail and examples (e.g. video ads, flyer design, shop banners).
2. Add industry pages based on actual customer segments: restaurants, salons, fashion shops, hotels, retail shops and events. Each must include original examples, specific use cases, FAQs and a useful CTA; avoid doorway pages with near-identical copy.
3. Publish practical guides in English and Kinyarwanda: writing a good promotion, preparing a flyer brief, choosing video formats for WhatsApp Status/Reels, and preparing a print-ready shop banner.
4. Build trust: real contact details, business identity, clear pricing, portfolio attribution/permission, privacy policy, terms, and customer testimonials only with permission.
5. Earn relevant links through real partnerships, customer showcases, local business communities, incubators and credible Rwanda business directories. Never buy spam links.

## Measurement
- Search Console: submit sitemap, inspect and request indexing for the four public URLs, monitor Pages indexing, Core Web Vitals and Manual Actions.
- Weekly: compare clicks, impressions, CTR and average position by page, query, country and device.
- After 4–8 weeks of data: rewrite titles/snippets with low CTR; expand pages receiving impressions for relevant queries; do not judge SEO after only a few days.
- Track conversions separately (create-ad clicks, contact enquiries, completed orders) so traffic quality matters more than raw visits.

## Manual Search Console checklist
1. Open the verified Amamaza property.
2. Go to Sitemaps and submit: sitemap.xml
3. Use URL Inspection on /, /services, /examples and /pricing; request indexing after the latest deployment is live.
4. Check Pages > indexing for blocked, duplicate, crawled-not-indexed and discovered-not-indexed URLs.
5. Check Performance > Search results after data accumulates; export queries and pages monthly.
6. Add the business profile and local business details only after Amamaza has a genuine eligible business address/contact setup. Never publish placeholder contact information as fact.

## Guardrails
- No one can guarantee position #1. SEO is a sustained process, not a code switch.
- Do not invent keyword volumes, customer reviews, business addresses, pricing, AI capabilities or payment availability.
- Do not create thin pages solely to target city/industry keyword variations.
- Ensure all primary page content is visible and useful without requiring a user to interact with filters.
