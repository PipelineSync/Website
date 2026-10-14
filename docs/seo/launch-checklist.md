# SEO launch checklist (owner)

Run this after the SEO pull request is merged and Netlify has deployed `main` to https://pipelinesync.net/. Last updated: 2026-10-14.

Menu names in Google, Bing, HubSpot and Netlify change often. If a path below does not match, search the product's help centre for the step name.

**IDs to collect and paste (one place: `src/_data/site.json`):**

| Key | Value | Where it comes from |
|---|---|---|
| `analytics.ga4Id` | `G-ZYR7TRJ6T8` (set) | GA4 → Admin → Data streams → web stream → Measurement ID |
| `analytics.googleSiteVerification` | only if not using DNS `TODO(owner)` | GSC → URL-prefix property → HTML tag method (the `content` value only) |
| `analytics.bingSiteVerification` | only if not importing from GSC `TODO(owner)` | Bing Webmaster Tools → meta tag method |

Note: the IDs live under the `analytics` key in `src/_data/site.json` (`analytics.ga4Id`, `analytics.googleSiteVerification`, `analytics.bingSiteVerification`). Empty values mean the tag is simply not output. After changing the file, commit to `main` (or via PR) so Netlify rebuilds. Profile links (`sameAs`, `hubspotDirectoryUrl`, `founder.sameAs`) are in the same file and feed the structured data.

---

## 1. Google Search Console (day 0)

- [ ] **Add a Domain property** for `pipelinesync.net` (preferred: covers https/http, apex and www).
  - GSC → Add property → Domain → copy the `google-site-verification=…` TXT record.
  - At your DNS provider (`TODO(owner)`: Netlify DNS or registrar), add a TXT record on the root (`@`) with that value. Wait for propagation, then click Verify.
- [ ] **Alternative (only if DNS is not possible):** add a URL-prefix property `https://pipelinesync.net/`, choose "HTML tag", paste only the `content` value into `src/_data/site.json` → `analytics.googleSiteVerification`, deploy, then click Verify. Keep the tag in place permanently.
- [ ] **Users:** add the developer and any agency as Restricted or Full users (not Owner).
- [ ] **Sitemaps:** Indexing → Sitemaps → submit `https://pipelinesync.net/sitemap.xml`. Status should be "Success" with the expected URL count (12 resources + core pages + any new service pages).
- [ ] **URL Inspection → Request indexing** for the top 8 URLs (one at a time; there is a daily quota):
  1. `https://pipelinesync.net/`
  2. `https://pipelinesync.net/solutions/`
  3. `https://pipelinesync.net/integrations/`
  4. `https://pipelinesync.net/resources/`
  5. `https://pipelinesync.net/about/`
  6. `https://pipelinesync.net/resources/hubspot-crm-architecture-blueprint/`
  7. `https://pipelinesync.net/resources/crm-cleanup-deduplication-system-pipelinesync/`
  8. `https://pipelinesync.net/resources/lead-routing-lifecycle-automation-pipelinesync/`

  When the new service pages ship, request indexing for each of them as well (`/solutions/hubspot-implementation/`, `/solutions/hubspot-migration/`, `/solutions/hubspot-crm-cleanup/`, `/solutions/revops/`, `/solutions/hubspot-audit/`, `/solutions/hubspot-admin/`).
  For each URL, before requesting: check "Page is indexable", the Google-selected canonical equals the URL, and "View tested page" shows the real content (not only the loading screen).
- [ ] **Reports to check after 3–7 days:**
  - Indexing → Pages: "Not indexed" reasons. Expected: `/404.html` (noindex) and old WordPress URLs (redirects). Investigate "Crawled – currently not indexed" and "Duplicate without user-selected canonical".
  - Experience → Core Web Vitals (mobile and desktop). Needs ~28 days of field data; may say "not enough data" for a small site.
  - Experience → HTTPS: all URLs HTTPS.
  - Enhancements: **Breadcrumbs**, **FAQ** (Google only shows FAQ rich results for some authoritative sites; valid markup is still fine), and any Article-related items. Fix every "Invalid item". GSC no longer has a dedicated Article report for all sites: use the Rich Results Test (section 6) for articles.
  - Links: top linked pages internally and externally (baseline for the off-site plan).
- [ ] Settings → Associations: link to the GA4 property (section 3).

## 2. Bing Webmaster Tools (day 0)

- [ ] bing.com/webmasters → sign in → **Import from Google Search Console** (fastest; imports verified sites and sitemaps).
- [ ] If import fails: add site manually, verify via DNS CNAME/TXT or meta tag (`bingSiteVerification`), submit `https://pipelinesync.net/sitemap.xml`.
- [ ] Check Site Explorer and URL Inspection for the top 8 URLs. Optional: enable IndexNow later if the developer adds it.

## 3. Google Analytics 4 (day 0)

- [ ] Create a GA4 property "PipelineSync" (timezone `TODO(owner)`: the one you report in; currency USD).
- [ ] Create a **Web data stream** for `https://pipelinesync.net`. Keep Enhanced measurement on (page views, scrolls, outbound clicks). Turn off "Form interactions" if it double-counts the HubSpot form (verify after testing).
- [ ] Copy the Measurement ID into `src/_data/site.json` → `analytics.ga4Id`. Deploy. No ID = no GA4 script (by design).
- [ ] **Consent:** confirm the GA4 tag waits for consent per the banner settings (section 4). `TODO(owner)`: decide where consent is required (UK/EU at minimum).
- [ ] **Verify events** in Admin → DebugView or Reports → Realtime while you click through the site:

  | Event | Trigger | Key event? |
  |---|---|---|
  | `generate_lead` | HubSpot consultation form submitted | **Yes (primary)** |
  | `open_consultation` | Consultation modal opened | Secondary |
  | `roi_calculated` | ROI calculator used | Secondary |
  | `click_phone` | Click on phone link | Secondary |
  | `click_whatsapp` | Click on WhatsApp link | Secondary |
  | `click_email` | Click on email link | Secondary |
  | `resource_open`, `pipeline_demo_interact` | Resource card click, hero console interaction | No (engagement only) |

- [ ] **Mark key events:** Admin → Data display → Events (or Key events) → toggle "Mark as key event" for `generate_lead`. Optionally mark the secondary events too, but report `generate_lead` as the main conversion. Events appear in the list only after they fire once; you can also create a key event by typing its exact name.
- [ ] **Data retention:** Admin → Data collection and modification → Data retention → Event data retention = **14 months** → Save.
- [ ] **Internal traffic:** Admin → Data streams → web stream → Configure tag settings → Define internal traffic → add the office IP(s) (`TODO(owner)`) with `traffic_type = internal`. Then Admin → Data filters → "Internal Traffic" → check in Testing for a few days → set to **Active**. Also exclude developer traffic (filter or a browser extension).
- [ ] **Unwanted referrals:** Configure tag settings → List unwanted referrals → add HubSpot form/meeting domains if they appear as referrers (verify in reports first).
- [ ] **Link Search Console:** Admin → Product links → Search Console links → Link → choose the `pipelinesync.net` property and the web stream. Then publish the Search Console report collection in Reports → Library.
- [ ] **Google Signals:** leave off unless needed (simpler privacy story).

## 4. HubSpot (day 0–1)

- [ ] **Cookie banner:** HubSpot → Settings → Privacy & Consent → Cookies (verify path). Confirm:
  - Exactly one banner on the site (do not run HubSpot's banner and a custom one together). `TODO(owner)`: which banner is used.
  - Banner shown for UK/EU visitors at minimum, with "accept" and "decline" equally prominent; categories (analytics, advertisement, functionality) match what the site actually loads, including GA4 if enabled.
  - Cookie policy link points to `/about/privacy-policy/`.
  - Decline really blocks HubSpot analytics and GA4 (check DevTools → Application → Cookies after declining).
- [ ] **Connect Google Search Console in HubSpot:** HubSpot SEO tool (Marketing → Website → SEO, or Settings → Content → SEO; verify) → Connect Google Search Console → sign in with the GSC owner account → choose `pipelinesync.net`. **Verify** whether HubSpot supports a property for an externally hosted site in your tier.
- [ ] **Original source and UTMs:** visit `https://pipelinesync.net/?utm_source=launch-test&utm_medium=test&utm_campaign=seo-launch` in a private window, accept cookies, submit the consultation form with a test email. In the new contact check: Original Source, Original Source Drill-Down 1/2, first page seen, and form submission page. Then delete the test contact.
  - If UTMs are missing, add hidden UTM fields to the form or rely on HubSpot's tracking cookie (developer task).
  - Expect declined-cookie visitors to show "Offline sources" or similar; that is correct behaviour.
- [ ] **Attribution reports:** set up a "Contacts by original source" and "Deals by original source" report; add a filter for `utm_source` values used by directories and social profiles (see offsite playbook UTM table).
- [ ] **Chat:** confirm chat still loads and that its cookies are listed in the banner categories.

## 5. Netlify (day 0)

- [ ] **Deploy previews not indexable:** open any PR's deploy preview and run
  `curl -sI https://deploy-preview-<N>--<site-name>.netlify.app/ | grep -i x-robots-tag`
  Expected: `x-robots-tag: noindex`. Netlify adds this to deploy previews and branch deploys by default; if missing, ask the developer to add a context-scoped header rule. Also check that `<site-name>.netlify.app` (the production subdomain) redirects to `https://pipelinesync.net/`.
- [ ] **HTTPS forced:** Site configuration → Domain management → HTTPS: certificate active, "Force HTTPS" on. Test `curl -sI http://pipelinesync.net/` returns 301 to `https://pipelinesync.net/`.
- [ ] **Apex domain primary:** Domain management → primary domain = `pipelinesync.net`; `www.pipelinesync.net` redirects (301) to the apex. Test `curl -sI https://www.pipelinesync.net/`.
- [ ] **404 status:** `curl -sI https://pipelinesync.net/does-not-exist/` returns `404`.
- [ ] **Legacy redirects:** spot-check 3 old WordPress URLs from `src/_redirects` return 301 to the right page.

## 6. Structured data validation (day 1)

Test each URL in both tools: Rich Results Test (search.google.com/test/rich-results) and Schema Markup Validator (validator.schema.org).

| Page | URL | Expect |
|---|---|---|
| Home | `https://pipelinesync.net/` | Organization / ProfessionalService, WebSite, WebPage, FAQPage |
| Solutions | `https://pipelinesync.net/solutions/` | WebPage, Service(s), BreadcrumbList |
| Resources | `https://pipelinesync.net/resources/` | CollectionPage, ItemList, BreadcrumbList, FAQPage |
| Guide | `https://pipelinesync.net/resources/hubspot-crm-architecture-blueprint/` | Article, BreadcrumbList |
| Article | `https://pipelinesync.net/resources/why-your-hubspot-pipeline-doesnt-reflect-reality-pipelinesync/` | Article / BlogPosting, BreadcrumbList |
| About | `https://pipelinesync.net/about/` | AboutPage, Person (founder), Organization, BreadcrumbList |

- [ ] Zero errors in both tools. Warnings on optional fields are acceptable; note them for the developer.
- [ ] No `Review` / `AggregateRating` for PipelineSync itself.
- [ ] Check social previews: LinkedIn Post Inspector (linkedin.com/post-inspector) and a Facebook share preview for home and one article (image, title, description).

## 7. 30 / 60 / 90-day reviews

| Check | Where | Day 30 | Day 60 | Day 90 |
|---|---|---|---|---|
| Queries: impressions, clicks, position for target keywords (see keyword map) | GSC → Performance → Queries (filter by country: US, AU, CA, UK) | Baseline | Compare | Compare, re-rank content plan |
| CTR by page; pages with impressions but CTR under ~1% | GSC → Performance → Pages | Rewrite titles/descriptions for the worst 3 | Repeat | Repeat |
| Indexing errors and excluded pages | GSC → Pages; Bing Site Explorer | Fix | Fix | Fix |
| Core Web Vitals (field) and Lighthouse (lab) on key pages | GSC → Core Web Vitals; PageSpeed Insights | Note | Fix regressions | Fix regressions |
| Enhancements (Breadcrumbs, FAQ) valid items | GSC → Enhancements | Check | Check | Check |
| Conversions: `generate_lead` and secondary events by landing page and source | GA4 → Reports → Engagement → Key events; Explorations | Baseline | Compare | Compare |
| Leads by original source; directory/social UTM leads | HubSpot reports | Baseline | Compare | Compare |
| New referring domains and links | GSC → Links; Ahrefs/Semrush | Count | Count | Count vs 90-day plan |
| New reviews by platform | HubSpot directory, Clutch, Google, Upwork | Count | Count | Count |
| New content published vs calendar | `docs/seo/content-plan.md` | 2 | 4 | 6 |

Keep a short log (date, what changed, result) so changes can be tied to movements in the data.

## AI search endpoints (live after the roadmap PR)

- [ ] `https://pipelinesync.net/robots.txt` shows the AI crawler policy.
- [ ] `https://pipelinesync.net/llms.txt` loads and lists the services and guides.
- [ ] `https://pipelinesync.net/676a63992c44e8f67c923e3c87a623b6.txt` returns the IndexNow key.
- [ ] Netlify deploy log for the production deploy shows `IndexNow: submitted N URL(s), HTTP 200` (or 202).
- [ ] In Bing Webmaster Tools → IndexNow, submitted URLs appear within a day.
