# PipelineSync — Complete SEO Setup Prompt

> **How to use:** paste everything below the line into a new agent session that has the
> `PipelineSync/Website` repository checked out. The prompt is self-contained: it carries the
> business facts, the codebase facts, the confirmed audit findings, the owner's decisions, the
> phased work plan, acceptance criteria, and the open questions the agent must ask before acting.
> Fill in the `[CONFIRM: …]` items you already know (GTM ID, address, etc.) before pasting.

---

You are a senior technical SEO engineer and B2B content strategist working inside the
`PipelineSync/Website` Git repository: an **Eleventy 3 (Nunjucks) static site deployed on Netlify**
at **https://pipelinesync.net**. Your job is to implement a complete, production-grade SEO setup
for this site, end to end:

1. technical foundation and bug fixes,
2. metadata, favicons and social-preview (Open Graph) system,
3. structured data (JSON-LD) system,
4. internal linking and information architecture,
5. performance / Core Web Vitals,
6. URL cleanup with permanent redirects,
7. content expansion and E-E-A-T,
8. tracking through Google Tag Manager, consent, and search-engine verification,
9. CI quality gates that keep all of the above from regressing,
10. an off-site and operations program (Search Console, Bing, directories, links, reporting).

Work **in phases, in the order given**. Every phase must leave the site buildable
(`npm run check` passes) and deployable. Open **one pull request per phase** (Phases 1 and 2 may be
combined) against `main`, each with a before/after summary. Do not start from scratch, do not
replace the design system, and do not remove functionality that is not explicitly listed as
removable in §4.

---

## 0. Ground rules

1. **Facts only.** Never invent reviews, ratings, addresses, founding dates, awards, client
   results, publish dates, headcounts, or credentials. Use the facts in §1. Anything marked
   `[CONFIRM: …]` must be confirmed with the owner before it is used.
2. **No `AggregateRating` / `Review` markup for PipelineSync's own services.** Self-serving
   reviews are ineligible for rich results and can attract a manual action. Testimonials stay as
   plain HTML.
3. **Nunjucks autoescaping is ON.** Front matter must contain raw characters (`&`, not `&amp;`).
   Two pages are currently broken by this (see §3).
4. **URL hygiene.** Every URL in canonicals, sitemap, JSON-LD, OG tags, and internal links is
   either absolute (`https://pipelinesync.net/...`) or root-relative, lowercase, and ends with a
   trailing slash (files such as `/sitemap.xml` excepted). `@id`, `url`, canonical and `og:url`
   must be byte-identical for a page.
5. **Run `npm run check` after every change set.** Extend the checker (Phase 9) rather than
   weakening it. It currently hard-codes `expected = 18` pages; make that dynamic the first time
   you add a page.
6. **Validate on the Netlify Deploy Preview before merging** using: Google Rich Results Test,
   Schema.org validator, Facebook Sharing Debugger, LinkedIn Post Inspector, PageSpeed Insights
   (mobile), and `curl -I` for every redirect you touch.
7. **Ask before acting** on anything listed in §12 (open items). Batch your questions; do not
   block on them where a safe default exists (the default is stated next to each item).
8. **Document as you go** in `docs/seo/` (file list in §11) and keep `README.md` current.
9. **Capture a baseline first** (Phase 1, step 0) so every later claim of improvement is measurable.

---

## 1. Business facts (source of truth for copy and schema)

| Item | Value |
|---|---|
| Brand / legal name | PipelineSync `[CONFIRM: registered legal entity name, if different]` |
| Canonical origin | `https://pipelinesync.net` (apex is primary; `www` 301s to apex; Force HTTPS on in Netlify) |
| What it is | HubSpot Solutions Partner (HubSpot **Gold** badge is displayed site-wide) `[CONFIRM: current tier wording to use in copy, e.g. "HubSpot Gold Solutions Partner"]` |
| Founded | 2025 |
| Team | Eight people: founder, five HubSpot implementation specialists, two social-media/admin |
| Location | Office in the **Philippines**; works **US business hours** `[CONFIRM: city + street address, and whether it may be published / used for Google Business Profile]` |
| Markets served | United States, Australia, Canada, United Kingdom |
| Founder | **Allen Trinidad** — Founder & HubSpot Solutions Architect; previously a HubSpot subject-matter expert (exact wording: see `src/about/index.njk`) `[CONFIRM: LinkedIn profile URL, certifications to list]` |
| Services (anchors on `/solutions/`) | `#implementation` HubSpot implementation · `#migration` CRM migration · `#cleanup` data cleanup & deduplication · `#revops` RevOps infrastructure · `#custom-integrations` custom integrations · `#training-sops` training & SOPs. Section ids: `#services`, `#process`, `#engagement-models` |
| Integrations shown (24) | Aircall, Aloware, Calendly, Databox, Facebook Ads, Google Ads, Google Analytics, HubSpot, LinkedIn Ads, Looker Studio, Mailchimp, Make, Microsoft Teams, PandaDoc, Pipedrive, QuickBooks, REST API, Salesforce, Slack, Stripe, Webhooks, Xero, Zapier, Zoom |
| Client logos used in testimonials | BH Labs, CW Systems, ESA, Independent Energy, Interview Coach, Jayo, S8T, Broker Capital, Crypto Consulting, Gutierrez, Modern Engineering, Private Tax Solutions `[CONFIRM: which clients may be named in case studies]` |
| Phone | +1-646-729-2936 |
| WhatsApp | +63 930 122 8191 (`https://wa.me/639301228191`) |
| Email | Intentionally obfuscated client-side in `assets/js/contact-email.js` (`allentrinidad@pipelinesync.net`). **Do not** put it in plain HTML or JSON-LD unless the owner approves `[CONFIRM]` |
| Social profiles | LinkedIn `https://www.linkedin.com/company/pipelinesync` · Upwork `https://www.upwork.com/agencies/pipelinesync/` · Instagram `https://www.instagram.com/pipelinesync` · Facebook `[CONFIRM: canonical page URL; the footer currently uses a share link with tracking params]` · X/Twitter: none found `[CONFIRM]` |
| HubSpot | Portal `247123252` (region `na2`) · consultation form `925b2a78-2998-4846-a6e8-a7514007fb93` · tracking loader `//js-na2.hs-scripts.com/247123252.js` · chat widget in use |
| Footer badge text | "HubSpot Solutions Partner — Serving the United States, Australia, Canada, and the United Kingdom — Working US business hours" |
| Copyright | © 2026 PipelineSync. All rights reserved. |
| Language | English only (`en`). No hreflang needed unless regional variants are created. |

### 1.1 Page inventory (18 indexable pages today)

| Type | URL today | H1 |
|---|---|---|
| Home | `/` | Make the CRM work like the business. |
| Service hub | `/solutions/` | HubSpot built around how your team actually works |
| Integrations hub | `/integrations/` | Connect HubSpot to the tools your team already uses |
| Resources hub (tabs: Guides / Articles / SOPs & Templates / FAQs) | `/resources/` | HubSpot guides, templates, and playbooks |
| About | `/about/` | We build HubSpot systems teams actually use |
| Privacy | `/about/privacy-policy/` | Privacy Policy |
| Guide | `/resources/hubspot-crm-architecture-blueprint/` | HubSpot CRM Architecture Blueprint |
| Guide | `/resources/crm-cleanup-deduplication-system-pipelinesync/` | CRM Cleanup and Deduplication System |
| Guide | `/resources/lead-routing-lifecycle-automation-pipelinesync/` | Lead Routing & Lifecycle Automation |
| Guide | `/resources/integration-governance-monitoring-pipelinesync/` | Integration Governance & Monitoring |
| Guide | `/resources/full-funnel-attribution-that-ceos-trust-pipelinesync/` | Full-Funnel Attribution Leadership Can Trust |
| Article | `/resources/why-your-hubspot-pipeline-doesnt-reflect-reality-pipelinesync/` | Why Your HubSpot Pipeline Does Not Reflect Reality |
| Article | `/resources/the-cost-of-duplicate-data-in-hubspot-pipelinesync/` | What Duplicate Data Actually Costs You |
| Article | `/resources/automation-that-saves-10-hours-week-pipelinesync/` | Automation That Saves Your Team Hours Every Week |
| Article | `/resources/why-teams-dont-adopt-hubspot-and-how-we-fix-it-pipelinesync/` | Why Teams Do Not Adopt HubSpot |
| Template | `/resources/hubspot-governance-checklist-pipelinesync/` | HubSpot Governance Checklist |
| Template | `/resources/data-migration-mapping-sheet-pipelinesync/` | Data Migration Mapping Sheet |
| Template | `/resources/lead-routing-decision-tree-pipelinesync/` | Lead Routing Decision Tree |
| (not indexed) | `/404.html` | — |

Resource pages are ~630–730 words each; main pages 1,000–1,900 words.

---

## 2. Codebase facts

- **Stack:** `@11ty/eleventy ^3.1.2`, Nunjucks only (`templateFormats: ['njk']`), input `src/`,
  includes `src/_includes/`, output `_site/`. There is **no `src/_data/` directory yet**.
  Node ≥ 20. Netlify builds with `npm run build`, publishes `_site`, Node 20.
- **Passthrough copies:** `assets/` → `/assets/`, `src/icon.png` → `/icon.png`,
  `src/robots.txt`, `src/_redirects`. `.eleventy.js` defines a `v` filter that appends a content
  hash (`?v=xxxxxxxx`) for cache busting.
- **Layout:** one shell, `src/_includes/layouts/base.njk`. Head is driven by front matter keys:
  `title`, `description`, `robots`, `canonical`, `ogType`, `ogImage`, `schema` (a raw JSON string
  pasted per page), plus `layoutType` (`modern` | `guide` | `privacy`), `loadingType`, `cssGroup`,
  `pageCss`, `pageJs`, `anim`, `hero_*`, `lastmod`, `changefreq`, `priority`, `headerEmailAttr`.
- **Partials:** `header-modern/guide/privacy.njk`, `footer-modern/guide/privacy.njk`,
  `modal-modern/guide.njk` (HubSpot consultation popup), `hero-*.njk`,
  `loading-pipeline.njk`, `loading-resources.njk`.
- **Sitemap:** `src/sitemap.xml.njk` iterates `collections.all`, excludes `/404.html` and
  `sitemap: false`, falls back to a hard-coded `lastmod` of `2026-10-03`.
- **robots.txt:** allows everything, lists the sitemap.
- **Redirects:** `src/_redirects` holds WordPress-era rules (`/wp-*`, `/feed/*`, `*.html`,
  percent-encoded legacy guide names). `/privacy-policy.html` appears twice.
- **Headers:** `netlify.toml` sets `Cache-Control` for HTML (`max-age=0, must-revalidate`) and
  `/assets/*` (`immutable`). No security headers.
- **CI:** `.github/workflows/check-and-preview.yml` runs `npm ci && npm run check` on push/PR to
  `main`. `tools/check-site.mjs` validates: exactly 18 HTML pages, canonical == route, `<title>`
  present, no inline `<style>`, root-relative internal links resolve, `/assets/` images exist and
  have `width`/`height`, sitemap has 18 URLs, required files exist.
- **CSS:** `site.css` + a group file (`marketing.css` | `guides.css` | `privacy.css`) + a
  page file (`pages/*.css`) + `theme-neon.css`, `layouts-neon.css`, `hubspot-chat.css`,
  `page-motion.css` — 8–9 stylesheets per page, all render-blocking.
- **Fonts / icons (third-party, render-blocking):** Google Fonts — IBM Plex Mono 500/600,
  Space Grotesk 500/600/700, Inter 400/500/600/700, Manrope 500/600/700; Font Awesome 6.5.2 full
  CSS from cdnjs (64 distinct `fa-*` icon classes actually used).
- **JS:** 12–18 `<script src>` tags at the end of `<body>`, none `defer`; HubSpot embed is
  `async defer`; HubSpot forms embed `js-na2.hsforms.net/forms/embed/247123252.js` on all
  non-privacy pages; `contact-email.js`, `roi-calculator.js`, `motion.js`, `page-motion.js`,
  cursor scripts, `reveal.js`.
- **Loading screen (approved for removal, see §4):** partials `loading-pipeline.njk`,
  `loading-resources.njk`; `assets/js/loading-screen.js`; references in `page-motion.js` and
  `pages/{about,index,integrations,resources,solutions}.js`; CSS blocks in `site.css`,
  `guides.css`, `privacy.css`, `theme-neon.css`, `pages/{404,about,index,integrations,resources,solutions}.css`;
  `loadingType` front matter on all 18 pages + `404.njk`; include + script lines in `base.njk`;
  mentioned as "do not break" in `docs/pipelinesync-continuation-prompt.txt` and `README.md`.
- **Images:** WebP + PNG/JPEG fallbacks via `<picture>`, intrinsic dimensions present, 36 images
  lazy-loaded, one `fetchpriority="high"` (404 hero only). Oversized files: hero WebPs
  480–505 KB each, client logos 0.4–1.2 MB PNG fallbacks, `HubSpot-Gold-Badge.png` 1536×1024 /
  1 MB. `assets/img` totals 11 MB. `tools/prepare_images.py` + `tools/images-to-download.txt`
  manage sources.
- **Favicon:** only `/icon.png` at **94×128 (non-square)** — Google requires a square icon that
  is a multiple of 48 px (or SVG) to show a favicon in results.
- **Tracking:** HubSpot only. No GTM, GA4, Search Console or Bing verification.

---

## 3. Confirmed audit findings (all must be fixed)

**P0 — bugs visible to Google and social networks**

1. **Broken Open Graph image.** `/`, `/solutions/`, `/integrations/`, `/resources/`, `/about/`
   point `og:image`/`twitter:image` at `https://pipelinesync.net/pipelinesync_logo_transparent.png`,
   **which does not exist in the repo** (only `src/icon.png` is published). The other 13 pages set
   `ogImage: ""`, so `base.njk` omits the tag entirely. Result: no preview image anywhere.
2. **Double-escaped titles.** `Integration Governance &amp; Monitoring` and
   `Lead Routing &amp; Lifecycle Automation` are written with `&amp;` in front matter and render as
   `&amp;amp;` → Google and browser tabs show the literal text "&amp;". Same defect in those pages'
   H1s.
3. **Stray heading from the loader.** The loading overlay injects
   `<h2>Getting your page ready</h2>` as the **first H2 on every page**, polluting the outline.
   Resolved by removing the loader (§4).

**P1 — missing or inconsistent SEO signals**

4. **12 resource pages have zero structured data** — no `Article`/`TechArticle`/`BlogPosting`,
   no `author`, `datePublished`/`dateModified`, no `BreadcrumbList`, no `mainEntityOfPage`.
   No visible byline or date either, despite a founder with HubSpot credentials (E-E-A-T gap).
5. **FAQ sections** on `/` (5 Q&As) and `/resources/` (8 Q&As) have no `FAQPage` markup.
6. **Organization schema is thin and duplicated by hand on 5 pages:** no `sameAs`, `founder`,
   `foundingDate`, `contactPoint`, `areaServed`, `numberOfEmployees`, `knowsAbout`;
   `logo.url` points at the missing PNG above.
7. **Schema URL mismatches:** `url`/`@id` values such as `https://pipelinesync.net/about` and
   `/solutions`, `/integrations`, `/resources` lack the trailing slash the canonicals use.
8. **Meta descriptions too short** on 10 of 12 resource pages (67–119 chars); `/solutions/` and
   `/about/` are over 160.
9. **`robots` meta inconsistency:** main pages set `max-image-preview:large, max-snippet:-1,
   max-video-preview:-1`; resource pages don't. Should be the layout default.
10. **No cross-linking among content.** Resource pages link only via header/footer/nav; there are
    no "related guides", no contextual links to the matching `/solutions/#section`, no breadcrumbs.
    `/integrations/` is de-emphasised in navigation.
11. **Sitemap `lastmod` is a hard-coded constant** (`2026-10-03`) for every URL; `changefreq` /
    `priority` are present but ignored by Google (harmless).
12. **Favicon** is non-square 94×128 (see §2) — likely no favicon in SERPs. No
    `apple-touch-icon`, no web manifest, no SVG icon.
13. **`og:image:alt` is hard-coded** to "PipelineSync logo"; no `og:image:width/height`; `ogType`
    `article` pages lack `article:published_time` / `article:modified_time`.
14. **Redirect file:** duplicate `/privacy-policy.html` rule; old `.html` rules will become
    redirect chains once slugs change (§Phase 6) unless rewritten to point at final URLs.
15. **No `noindex` on Netlify Deploy Previews / branch deploys** (`*.netlify.app`), and no 301
    from the `*.netlify.app` production alias to the custom domain → duplicate hosts.

**P2 — performance (affects rankings via Core Web Vitals and crawl efficiency)**

16. Full-screen loading overlay blocks first meaningful paint until `window.load` + ≥700 ms.
17. Four font families (11 weights) from Google Fonts + full Font Awesome CSS from cdnjs,
    8–9 render-blocking stylesheets, 12–18 non-deferred scripts, HubSpot forms embed loaded on
    every page even though the form lives in a modal.
18. Oversized images (see §2). LCP hero images are not preloaded (except 404).
19. No security headers (HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
    `Permissions-Policy`, frame-ancestors).

**P3 — growth gaps**

20. One page per service family; no dedicated pages for high-intent queries ("Salesforce to
    HubSpot migration", "HubSpot QuickBooks integration", "HubSpot data cleanup services", …).
21. No author page, no case studies, no contact page (contact is modal-only), no RSS feed.
22. No analytics, no Search Console, no Bing, no Google Business Profile, no directory presence
    tracked.

---

## 4. Owner decisions already made (you may act on these without asking)

| Topic | Decision |
|---|---|
| Scope | **Full SEO program**: technical + on-page + new content + tracking + off-site/operations checklist. |
| Loading screens | **Remove entirely** (both `pipeline` and `resources` variants). Prioritise Core Web Vitals. Update `README.md` and `docs/pipelinesync-continuation-prompt.txt` so they no longer list it as protected. |
| URL slugs | **Clean up allowed**, with permanent 301 redirects and no redirect chains. Proposed map in Appendix B; final slugs need a quick owner OK (§12) and are then frozen forever. |
| Tracking | **Google Tag Manager** is the single tag container (GA4 and anything else configured inside GTM). Container ID: `[CONFIRM: GTM-XXXXXXX]` — until supplied, implement with a placeholder that renders nothing when empty. |

---

## 5. What you must preserve

- The current visual system, header/footer branding, HubSpot Gold badge, footer text, copyright.
- Custom two-layer cursor on fine-pointer devices (disabled on touch / reduced motion), page
  animations, reveal effects, accordions, tabs, smooth scrolling, mobile menu, skip link, focus
  states, keyboard-accessible clickable cards.
- Lower-right **Calculate ROI** button + working ROI calculator (`assets/js/roi-calculator.js`).
- HubSpot consultation popup (portal `247123252`, form `925b2a78-2998-4846-a6e8-a7514007fb93`),
  HubSpot tracking, HubSpot chat widget positioning (`assets/css/hubspot-chat.css` + inline script
  in `base.njk`).
- Resources page tabs (Guides / Articles / SOPs & Templates / FAQs) and direct-link card behaviour.
- Privacy Policy **legal body copy unchanged** (metadata and schema may change).
- All 24 integration logos and the integrations filter UI.
- Existing WordPress-era redirects (they may be rewritten to final targets, never dropped).
- Email obfuscation (`data-contact-email` + `contact-email.js`).
- `npm run check` must keep passing; CI must stay green.

---

## Phase 1 — Baseline + P0 fixes (day 1)

**Step 0 — baseline (before touching anything).** Create `docs/seo/00-audit-baseline.md` with:
Lighthouse mobile scores (Performance / A11y / Best Practices / SEO) and lab LCP/CLS/TBT for `/`,
`/solutions/`, `/integrations/`, `/resources/`, `/about/`, one guide, one article, one template;
total page weight and request counts; a list of every `<title>`/description with lengths; the
rendered JSON-LD per page; a `site:pipelinesync.net` indexed-URL count; Search Console / GA data
if the owner can export any (they currently have none — note that).

**Step 1 — fix the P0 items**

1. Create a real default OG image (see Phase 2 for the system; for P0 at minimum commit
   `assets/img/og/og-default.png`, 1200×630, < 300 KB, brand colours, logo + "HubSpot Solutions
   Partner" tagline) and point every page at it; change `base.njk` to **fall back to the default
   when `ogImage` is empty** instead of omitting the tag.
2. Replace `&amp;` with `&` in the two affected front matter `title`s and H1s. Grep the whole
   `src/` tree for `&amp;`, `&quot;`, `&#39;` inside front matter values and fix all.
3. Remove the loading screens completely (see §2 for every touchpoint). Verify afterwards that no
   content depends on a `is-loading` / loader-finished class to become visible, that `reveal.js`
   leaves content visible when JavaScript fails (`no-js` fallback), and that the first H2 on every
   page is now a real content heading.
4. De-duplicate the `/privacy-policy.html` rule in `src/_redirects`.
5. Run `npm run check`, open PR "SEO Phase 1 — baseline and P0 fixes" with before/after Lighthouse
   numbers for `/`.

---

## Phase 2 — Metadata, favicons and social-preview system

1. **Site data.** Create `src/_data/site.json` (name, url, tagline, phone, whatsapp, social URLs,
   logo paths, default OG image, `gtmId`, `gscVerification`, `bingVerification`, `foundingDate`,
   `areaServed`, `founder` object). Create `src/_data/env.js` exposing Netlify's `CONTEXT`,
   `URL`, `DEPLOY_PRIME_URL` so templates know whether this is a production build.
2. **Layout defaults in `base.njk`:**
   - `robots` default = `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`;
     when `env.context !== 'production'` force `noindex, nofollow` and also emit
     `X-Robots-Tag: noindex` through a generated `_headers` file (or a `[context.deploy-preview]`
     build step) so previews and branch deploys never get indexed.
   - `og:image` → page `ogImage` or `site.defaultOgImage`; add `og:image:width` 1200,
     `og:image:height` 630, `og:image:alt` from `ogImageAlt` (default = page title),
     `og:image:type` matching the real file type.
   - For `ogType: article` emit `article:published_time`, `article:modified_time`,
     `article:author` (author page URL), `article:section`.
   - `twitter:card summary_large_image`; add `twitter:site` / `twitter:creator` only if an X
     account exists `[CONFIRM]`.
   - Remove the canonical from `/404.html` (keep `noindex`). Verify Netlify serves it with HTTP 404.
   - Add `<link rel="alternate" type="application/rss+xml">` once the feed exists (Phase 7).
3. **Favicon set** generated from the square `assets/img/cropped-logo-only.png` (512×512):
   `favicon.ico` (16/32/48), `favicon.svg` (if a vector logo exists `[CONFIRM]`, else skip),
   `favicon-96x96.png`, `apple-touch-icon.png` (180×180), `web-app-manifest-192x192.png`,
   `web-app-manifest-512x512.png`, `site.webmanifest` (name, short_name, theme `#040B16`,
   background, icons). Keep `/icon.png` published for backwards compatibility.
4. **OG image system.** Add a build-time generator (`tools/generate-og-images.mjs`, using `sharp`
   + an SVG template with brand type and colours) that renders a 1200×630 image per page from its
   `title` and type label (Guide / Article / Template / Service), written to
   `assets/img/og/<slug>.png` and **committed** (deterministic deploys, no runtime dependency).
   Add `npm run og` and document it. Wire `ogImage` automatically from the page slug when a
   generated file exists, else default.
5. **Rewrite titles and descriptions** per Appendix A. Rules: title ≤ 60 chars (hard limit 65),
   primary keyword first, brand suffix ` | PipelineSync`; description 140–160 chars, one benefit,
   one proof point, one call to action, unique across the site; no keyword stuffing; the H1 may
   differ from the title but must share the primary term.
6. **Directory data files** to kill duplication: `src/resources/resources.11tydata.json`
   (`layout`, `layoutType: guide`, `cssGroup: guides`, `ogType: article`, `pageType: Article`,
   `changefreq`), and per-type tags (`guide`, `article`, `template`) so collections exist for
   Phase 3/4/7. Keep page-level overrides minimal.
7. **Sitemap:** `lastmod` must come from each page's `dateModified` front matter (ISO 8601 date);
   fail the build if missing (Phase 9). Drop `changefreq`/`priority` or keep them — your call, but
   do not leave constants that are untrue. Exclude `404`, `sitemap`, `feed`, and any page marked
   `sitemap: false`. Keep `robots.txt` pointing at it.
8. PR "SEO Phase 2 — metadata, favicons and social previews" with Sharing Debugger / Post
   Inspector screenshots for `/`, `/solutions/` and one guide.

---

## Phase 3 — Structured data system (JSON-LD)

Replace the five hand-pasted `schema:` blobs with **one partial**,
`src/_includes/partials/schema.njk`, that assembles a single `@graph` per page from `site.json` +
front matter (`pageType`, `datePublished`, `dateModified`, `author`, `faq`, `breadcrumbs`,
`related`). Templates in Appendix C. Requirements:

1. **Shared nodes on every page:** `Organization` (`@id https://pipelinesync.net/#organization`;
   `name`, `url`, `logo` → real 512×512 PNG, `image`, `description`, `foundingDate: "2025"`,
   `founder` → Person `@id`, `numberOfEmployees` (QuantitativeValue 8), `areaServed` (US, AU, CA,
   GB as `Country`), `knowsAbout` (HubSpot CRM, CRM implementation, CRM data migration, data
   quality / deduplication, revenue operations, HubSpot integrations), `contactPoint`
   (`telephone +1-646-729-2936`, `contactType "sales"`, `areaServed`, `availableLanguage "en"`),
   `sameAs` (clean social URLs, no tracking params)); `WebSite`
   (`@id …/#website`, `publisher`, `inLanguage en-US`, **no** `SearchAction` — there is no site
   search); `Person` for Allen Trinidad (`@id https://pipelinesync.net/about/allen-trinidad/#person`
   once the author page exists; `jobTitle`, `worksFor`, `image` headshot, `sameAs` LinkedIn
   `[CONFIRM]`, `knowsAbout`, `description`).
   Do **not** use `ProfessionalService`/`LocalBusiness` unless the owner approves publishing a
   street address `[CONFIRM]`; `Organization` + `areaServed` is correct for a remote service firm.
2. **Per-page node** by `pageType`: `WebPage` (home, solutions, integrations), `AboutPage`,
   `CollectionPage` + `ItemList` (resources hub — generated from collections so it can never drift
   from the cards), `ContactPage` (new contact page), `TechArticle` (guides), `BlogPosting`
   (articles), `Article` + `ItemList` of steps (templates/SOPs — `HowTo` rich results were retired,
   so don't rely on them), `FAQPage` (only where the Q&As are visibly rendered on the page; render
   HTML and JSON-LD from the same `faq` data). Every content node carries `headline` (≤ 110 chars),
   `description`, `image` (the page OG image; add 4:3 and 1:1 crops if you generate them), `author`
   → Person, `publisher` → Organization, `datePublished`, `dateModified`, `mainEntityOfPage`,
   `articleSection`, `wordCount`, `inLanguage`, `isPartOf` → WebSite, `about` → Organization.
3. **`BreadcrumbList` on every page except home**, derived from the URL (`Home › Resources › Guide
   title`; `Home › Solutions › Service title`), rendered visibly on resource and sub-service pages
   with the same labels.
4. **`Service` + `OfferCatalog`** on `/solutions/` listing the six services, each with a `url` to
   its anchor today and to its sub-page after Phase 7. `Service` node per sub-service page.
5. **Dates must be true.** `datePublished` = real first-publish date if the owner knows it
   `[CONFIRM]`; otherwise the date the page first appeared in this repository's git history, and
   never a date in the future. `dateModified` ≥ `datePublished`, updated only when content really
   changes.
6. **Validation gate:** JSON-LD must parse, every `@id` referenced must exist in the graph, every
   `url` must equal the canonical, and Rich Results Test must report zero errors for Article,
   Breadcrumb, Organization and FAQ on sample pages (warnings allowed, documented).
7. PR "SEO Phase 3 — structured data" with the `docs/seo/03-schema-spec.md` written from Appendix
   C and the validator results.

---

## Phase 4 — Internal linking and information architecture

1. **Related content block** at the end of every resource page (3 items, chosen by topic, stored
   as `related: [slug, slug, slug]` in front matter, rendered from the collection so titles/URLs
   can't go stale). Suggested pairings: Architecture Blueprint ↔ Governance Checklist ↔ Adoption
   article; Cleanup System ↔ Cost of Duplicates ↔ Migration Mapping Sheet; Lead Routing guide ↔
   Decision Tree ↔ Automation article; Integration Governance ↔ `/integrations/` ↔ Pipeline-reality
   article; Attribution ↔ Pipeline-reality ↔ Architecture.
2. **Contextual service CTA** inside each resource page body (not only the footer) linking to
   the matching `/solutions/#anchor` (later the sub-page) with descriptive anchor text
   ("HubSpot data cleanup and deduplication service", not "learn more").
3. **Hub pages link down, content links up and across:** `/solutions/` sections link to the
   relevant guide/template; `/` links to the top three guides and to the author page; `/about/`
   links to the author page and to case studies when they exist; `/integrations/` links to the
   Integration Governance guide and to integration detail pages.
4. **Navigation:** recommend restoring **Integrations** to the primary nav (it's currently
   de-emphasised, which starves it of internal PageRank) `[CONFIRM — default: add it]`. Add a
   compact "Resources" column (top five guides/templates) to the footer. Keep nav ≤ 6 items.
5. **Visible breadcrumbs** on all non-home pages (styled to match; `aria-label="Breadcrumb"`).
6. **Anchor-text audit:** no "click here" / bare URLs; external links carry `rel="noopener"`
   (and `nofollow` / `sponsored` only where appropriate — directories and social profiles do not
   need `nofollow`).
7. **Orphan rule for CI (Phase 9):** every indexable page must receive ≥ 3 inbound links from
   *body content* (header/footer/nav excluded) on other pages.
8. PR "SEO Phase 4 — internal linking" with a link-graph summary (inbound counts per page before
   / after).

---

## Phase 5 — Performance and Core Web Vitals

Targets (mobile, PageSpeed Insights lab + CrUX field once available): **Performance ≥ 90,
Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100; LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms;
home page ≤ 1 MB transferred; first-party JS ≤ 150 KB compressed.**

1. **Fonts.** Self-host as subsetted `woff2` (latin), `font-display: swap`, `<link rel=preload>`
   only for the body regular and the heading bold; delete the Google Fonts `<link>`s and
   preconnects. Grep the CSS first — drop any family/weight that isn't actually used
   `[CONFIRM: owner approval if a visible family changes]`.
2. **Icons.** Replace the full Font Awesome stylesheet with an **inline SVG sprite** of the 64
   icons in use (generated from the `@fortawesome/fontawesome-free` package by a script into
   `assets/img/icons.svg`, used via a Nunjucks shortcode `{% icon "plug" %}` →
   `<svg aria-hidden="true"><use href="/assets/img/icons.svg#plug"/></svg>`). Decorative icons stay
   `aria-hidden`; icon-only buttons get `aria-label`.
3. **CSS.** Bundle per layout (`marketing`, `guides`, `privacy`) into one minified file each
   plus `site.css`; inline critical above-the-fold CSS for the hero (optional, measure first).
   Keep the `v` cache-busting filter. Remove dead CSS left by the loader.
4. **JavaScript.** Add `defer` to every first-party script; bundle shared scripts per layout
   with `esbuild` (devDependency; `npm run build` = `esbuild && eleventy`), keep page bundles
   separate and small; load motion/cursor code only when `prefers-reduced-motion: no-preference`
   and `(pointer: fine)`.
5. **Third-party.** Load the HubSpot **forms** embed lazily — on the first CTA click or when the
   modal is opened (keep a `<noscript>`/fallback link to a HubSpot-hosted form page
   `[CONFIRM URL]`). Keep the HubSpot tracking loader `async defer`. Delay the **chat widget**
   until first interaction or ~5 s (`window.hsConversationsSettings = { loadImmediately: false }`
   then `HubSpotConversations.widget.load()`), preserving the custom positioning.
6. **Images.** Regenerate hero WebPs at displayed size (≤ 960 px wide, quality ≈ 70) and add
   AVIF sources; resize client logos and the Gold badge to ≤ 2× displayed size; keep `width`/
   `height`; `loading="lazy"` + `decoding="async"` below the fold; exactly one
   `fetchpriority="high"` + `<link rel="preload" as="image">` for the LCP hero per page; update
   `tools/prepare_images.py` to emit sized variants so this stays reproducible. Target `assets/img`
   ≤ 4 MB.
7. **Headers (`netlify.toml`).** Add `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`,
   `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
   `Permissions-Policy` (camera/microphone/geolocation off), `Content-Security-Policy` with
   `frame-ancestors 'self'` (test that HubSpot forms/chat iframes still load before tightening
   further). Add a 301 from the `*.netlify.app` production alias to `https://pipelinesync.net/:splat`
   `[CONFIRM: netlify.app site name]`.
8. **Verify** with PageSpeed Insights on the deploy preview for the same 8 pages as the baseline;
   record before/after in `docs/seo/00-audit-baseline.md`.
9. PR "SEO Phase 5 — performance".

---

## Phase 6 — URL cleanup and redirects

1. Get the owner's OK on the slug map in Appendix B (defaults are safe to use). Rules: lowercase,
   hyphens, ≤ 6 words, primary keyword present, no brand suffix, no stop-word soup; **once live,
   never change again**.
2. Rename the `src/resources/<slug>/` directories (page CSS/JS filenames may stay as they are).
3. In `src/_redirects` add `old → new 301` rules **above** the wildcard WordPress rules, and
   rewrite every legacy `.html` and percent-encoded rule so it points **directly at the final URL**
   (no chains: old `.html` → `-pipelinesync` → new is forbidden). Keep the `/feed/*` rule but
   point it at `/feed.xml` once the RSS feed exists.
4. Update every reference: internal links, resources cards, `ItemList` schema, `related` lists,
   OG image filenames, `docs/pipelinesync-continuation-prompt.txt`, README.
5. Ship new URLs and redirects **in the same deploy**. Then: resubmit the sitemap in Search
   Console, run URL Inspection → Request indexing on the 12 new URLs, and watch the
   "Page with redirect" and "Not found (404)" reports weekly for a month.
6. Add a static redirect linter to CI (Phase 9): no duplicate sources, no rule whose target is
   another rule's source, every target resolves to a built page or an allowed external URL.
7. PR "SEO Phase 6 — URL cleanup" with `docs/seo/02-redirect-map.csv` and `curl -I` output for
   every old URL on the preview.

---

## Phase 7 — Content expansion and E-E-A-T

Write for the buyer (B2B founders, sales/marketing leaders, RevOps managers evaluating a HubSpot
partner). Plain English, specific, no filler. Every new page: unique ≥ 900 words (service pages)
or ≥ 1,000 words (guides), one H1, question-style H2/H3s where natural, a short summary at the
top, concrete steps/screenshots/diagrams with descriptive alt text, 3–5 page-specific FAQs
(rendered + `FAQPage`), a related-content block, a service CTA, breadcrumbs, author byline, dates.

1. **Author page** `/about/allen-trinidad/` (Person schema; bio, HubSpot background, credentials
   `[CONFIRM]`, LinkedIn, list of articles from the collection). Add a visible byline
   "By Allen Trinidad · Updated {dateModified}" to every resource page.
2. **Contact page** `/contact/` (ContactPage schema): the HubSpot form inline, phone, WhatsApp,
   hours ("US business hours"), markets, what happens after you book. Keep the modal CTA too.
3. **Service sub-pages** under `/solutions/` (keep `/solutions/` as the hub with shorter
   summaries; keep the existing `#anchors` working): `hubspot-implementation/`,
   `hubspot-migration/`, `hubspot-data-cleanup/`, `revops/`, `hubspot-training-and-sops/`.
   Custom integrations keep `/integrations/` as their page (don't duplicate). Each page: who it's
   for, problems solved, what we build, process, deliverables, timeline, engagement model, proof
   (logos/testimonials already on site), FAQs, CTA. Keyword targets in Appendix A.
4. **Migration child pages** (highest commercial intent): `/solutions/hubspot-migration/salesforce-to-hubspot/`,
   `/solutions/hubspot-migration/pipedrive-to-hubspot/`; add others (Zoho, Dynamics,
   spreadsheets) only with genuinely distinct content.
5. **Integration detail pages** under `/integrations/<tool>/` — start with 4–6 where PipelineSync
   has real delivery experience `[CONFIRM: which]` (candidates: Salesforce, QuickBooks, Stripe,
   Slack, Aircall/Aloware, Zapier/Make). ≥ 700 words each: use cases, sync design, field mapping,
   pitfalls, monitoring, FAQs. **Do not** generate 24 thin pages.
6. **Case studies** `/case-studies/` + 2–3 studies with permission `[CONFIRM]`: situation →
   build → measurable result → quote. Real numbers only.
7. **Refresh the 12 existing resources:** expand to ≥ 1,000 words where useful, add TL;DR,
   question headings, visuals, FAQs, related links, byline/dates. Pages whose titles promise an
   asset (Governance Checklist, Mapping Sheet, Decision Tree) must actually deliver it (download or
   embedded template; gated via HubSpot form or ungated `[CONFIRM]`).
8. **Resources hub:** make each tab a crawlable URL (`/resources/guides/`, `/resources/articles/`,
   `/resources/templates/`) with its own title/description/intro while keeping the tab UI
   (tabs become links; default view unchanged). Add an RSS feed `/feed.xml`
   (`@11ty/eleventy-plugin-rss`) for articles and guides.
9. **Editorial calendar** (`docs/seo/05-content-plan-90-days.md`): two articles per month for
   the first quarter targeting the clusters in Appendix A, e.g. "HubSpot lifecycle stages vs lead
   status", "HubSpot duplicate management: native tools vs a system", "How to audit a HubSpot
   portal before migrating", "HubSpot lead scoring that sales trusts", "Salesforce to HubSpot
   migration checklist", "HubSpot QuickBooks sync: what breaks and how to monitor it", "Why we
   work US hours from the Philippines (and what it means for your project)" — the last one is a
   genuine differentiator; write it honestly.
10. **Do not create** location/doorway pages ("HubSpot consultant Texas"); markets are expressed
    via copy, `areaServed`, and case studies.
11. One PR per batch ("SEO Phase 7a — author, contact, service pages", "7b — migration +
    integration pages", "7c — refreshes", …). Update `tools/check-site.mjs` page counts via the
    dynamic rule from Phase 9.

---

## Phase 8 — Tracking (GTM), consent, and verification

1. **GTM** snippet in `base.njk` (`<head>` as early as possible + `<noscript>` iframe after
   `<body>`), ID from `site.gtmId`; render nothing when the ID is empty or `env.context !==
   'production'` (previews must not pollute data). `[CONFIRM: GTM-XXXXXXX]`.
2. **Consent Mode v2.** Push default consent **before** the GTM snippet: `analytics_storage`,
   `ad_storage`, `ad_user_data`, `ad_personalization` = `denied` for EEA/UK visitors (UK is a
   target market → UK GDPR/PECR), `granted` elsewhere `[CONFIRM — default: denied for EEA/UK
   only]`; honour Global Privacy Control. Use the **HubSpot cookie banner** (already available
   with the HubSpot script; configure categories in HubSpot → Privacy & Consent) and bridge it
   to GTM with `_hsp.push(['addPrivacyConsentListener', …])` → `gtag('consent','update', …)`.
   Update the Privacy Policy's cookies section accordingly `[CONFIRM: legal copy]`.
3. **GA4 via GTM** with the events in Appendix D; mark `generate_lead` as a key event; link
   GA4 ↔ Search Console; enable enhanced measurement (outbound clicks, scroll, file downloads).
   Keep the HubSpot tracking loader on the page (forms/chat depend on it); do not also fire it
   from GTM.
4. **Search Console:** create a **Domain property** verified by DNS TXT at the registrar (covers
   apex, www, http, https) `[CONFIRM: who has registrar access]`; fallback `google-site-verification`
   meta from `site.gscVerification`. Submit `/sitemap.xml`. Add the owner and this agent's
   service account as users if allowed.
5. **Bing Webmaster Tools:** import from Search Console; submit the sitemap; enable **IndexNow**
   (`/<key>.txt` + a post-deploy ping script `tools/indexnow.mjs` for changed URLs — optional but
   cheap).
6. **AI crawlers:** decide `robots.txt` policy for `GPTBot`, `ClaudeBot`, `PerplexityBot`,
   `CCBot`, `Google-Extended` `[CONFIRM — default: allow; it's a lead-gen site that benefits from
   being cited]`.
7. `docs/seo/04-tracking-plan.md` with container structure, triggers, variables, consent flow,
   and QA steps (GTM preview + GA4 DebugView screenshots).
8. PR "SEO Phase 8 — tracking and verification".

---

## Phase 9 — CI quality gates (extend `tools/check-site.mjs`, add Lighthouse CI)

Add assertions (fail the build on any):

- page count derived from `src/**/index.njk` (minus `sitemap: false`), not a constant;
- `<title>` 15–65 chars, unique, no `&amp;amp;`/`&amp;quot;` double-escapes;
- `<meta name="description">` 70–160 chars, unique;
- canonical == route == `og:url` == JSON-LD `WebPage.url`; exactly one `<h1>`; no `<h2>` outside
  `<main>`; `lang="en"`;
- `og:image` present, same-origin files exist in `_site`, are 1200×630 and < 300 KB;
- JSON-LD parses; every `@id` reference resolves inside the page graph; required `@type`s per
  `pageType`; `datePublished`/`dateModified` valid ISO, not in the future, modified ≥ published;
- `BreadcrumbList` present on all non-home pages; `FAQPage` only when `.faq` HTML exists;
- sitemap: every indexable page present, no `noindex` pages, `lastmod` valid; `robots.txt` lists
  sitemap; 404 page has `noindex` and no canonical;
- `_redirects`: no duplicate sources, no chains, targets resolve; the 12 old `-pipelinesync` URLs
  are covered;
- inbound body-content links ≥ 3 per indexable page; no internal `http://`, no links to
  `*.netlify.app` or `pipelinesync.net/wp-content/`;
- every `<img>` has `alt` (empty allowed only on decorative images), `width`/`height`,
  `loading` set except the LCP image; no image > 300 KB served to mobile;
- no reference to Google Fonts / cdnjs after Phase 5; all scripts `defer`/`async`;
- `_site` contains favicons + manifest; production build has GTM only when `gtmId` is set and
  no `noindex`.

Add `@lhci/cli` to the GitHub workflow (`staticDistDir: _site`, mobile, 3 runs, budgets:
Performance ≥ 90, SEO = 100, LCP ≤ 2500 ms, CLS ≤ 0.1, total byte weight ≤ 1 MB for `/`).
Optionally add `html-validate` and `linkinator` against `_site`. Document all gates in README.

---

## Phase 10 — Off-site and operations program

Produce `docs/seo/06-offsite-checklist.md` and `docs/seo/07-monthly-report-template.md`, and
execute what can be executed from the repo; hand the rest to the owner as a checklist with
exact steps.

1. **Entity consistency (NAP+):** identical name, phone, markets, description and logo on the
   website, Google Business Profile, LinkedIn, Upwork, HubSpot Solutions Directory, Facebook,
   Instagram, Crunchbase, Clutch, G2 (service providers), GoodFirms, DesignRush. All profiles link
   to `https://pipelinesync.net/` and are listed in `sameAs`.
2. **Google Business Profile** for the Philippine office as a service-area business (honest
   address `[CONFIRM]`, hours = US business hours expressed in local time, services, photos,
   posts, Q&A, review link). Apple Business Connect and Bing Places via import.
3. **HubSpot Solutions Directory** listing (tier badge, services, industries, reviews from real
   clients) — the single most relevant backlink and lead source for a HubSpot partner.
4. **Reviews program:** ask every finished client for a Google review, a Clutch review, and a
   HubSpot Directory review (never incentivised, never fabricated). Show third-party review badges
   on the site as plain links, without self-serving `Review` markup.
5. **Link acquisition (quality over volume):** case studies with client backlinks; co-marketing
   with integration vendors (Aircall, Aloware, PandaDoc, Databox partner pages); guest posts and
   podcasts in the RevOps/HubSpot ecosystem; answers in the HubSpot Community linking to the
   guides where genuinely helpful; distribute the templates (Sheets/Notion) with attribution;
   founder's LinkedIn content pointing to new articles; expert-quote platforms (Qwoted, Featured,
   Help a B2B Writer). Track in a simple sheet: target, status, URL, DA, date.
6. **Monitoring cadence:** weekly for the first 4 weeks after Phase 6 (Search Console Pages
   report, 404s, redirect errors, Core Web Vitals); then monthly: clicks / impressions / CTR /
   avg position by page and query cluster, key events in GA4 (`generate_lead`, `roi_calculator_submit`,
   `contact_click`), CrUX field vitals, index coverage, new/lost backlinks, content shipped vs
   plan. Quarterly: refresh the top 10 pages (update `dateModified` only when content changes),
   prune or merge anything with zero impressions after 6 months.
7. **Optional / low-evidence (do last):** `llms.txt`, `humans.txt`, `security.txt`.

---

## 11. Deliverables and acceptance criteria

**Code (merged to `main`, CI green, Lighthouse CI green):**
- all Phase 1–6, 8, 9 changes; Phase 7 pages shipped in batches with the editorial calendar in
  place;
- `README.md` gains an "SEO" section: how to add a page with all SEO fields, how OG images are
  generated, how to change the GTM ID / verification tokens, what the CI gates check.

**Docs (`docs/seo/`):**
- `00-audit-baseline.md` (before/after metrics), `01-keyword-map.md` (Appendix A, validated),
  `02-redirect-map.csv`, `03-schema-spec.md`, `04-tracking-plan.md`,
  `05-content-plan-90-days.md`, `06-offsite-checklist.md`, `07-monthly-report-template.md`.

**Acceptance (all true on production):**
- Rich Results Test: 0 errors on home, solutions, one guide, one article, one template;
  Organization, Breadcrumb, Article, FAQ detected where intended.
- Sharing Debugger / LinkedIn Post Inspector show a correct image, title and description for
  every page type.
- PageSpeed Insights mobile: Performance ≥ 90, SEO = 100 on the 8 baseline pages; LCP ≤ 2.5 s,
  CLS ≤ 0.1.
- Search Console: domain property verified, sitemap "Success", 0 "Not found" for old URLs after
  30 days, all 12 renamed URLs indexed with the new canonical.
- GTM/GA4: `page_view`, `generate_lead`, `roi_calculator_submit`, `contact_click` visible in
  DebugView with consent handled; no tags fire on deploy previews.
- No fabricated fact anywhere (owner sign-off on §1 and on every `[CONFIRM]`).

---

## 12. Open items — ask the owner before acting (safe defaults in italics)

1. GTM container ID; GA4 property (or create inside GTM). *Default: placeholder, nothing renders.*
2. Real publish dates of the 12 resources. *Default: first git commit date, labelled as such.*
3. Final slugs (Appendix B). *Default: use Appendix B as written.*
4. Whether the office street address / city may be published (schema, GBP). *Default: country-level
   only, `Organization` not `LocalBusiness`.*
5. Whether the email may appear in schema/HTML. *Default: no.*
6. Facebook page canonical URL; X/Twitter handle (if any); Allen's LinkedIn URL; HubSpot
   certifications to list. *Default: omit what isn't confirmed.*
7. Which clients may be named in case studies; which integrations have real delivery depth.
   *Default: no case studies until confirmed; integration pages limited to Salesforce,
   QuickBooks, Stripe, Slack.*
8. Restore **Integrations** to primary navigation? *Default: yes.*
9. Consent default (deny everywhere vs deny EEA/UK only). *Default: deny EEA/UK only.*
10. AI crawler policy. *Default: allow.*
11. Gated vs ungated templates. *Default: ungated download + optional HubSpot form for the
    editable copy.*
12. Any other legacy WordPress URLs with traffic (export old Search Console / analytics if they
    exist) to add to the redirect map. *Default: current `_redirects` set.*
13. Font families that may be dropped for performance. *Default: self-host all four; drop only
    unused weights.*
14. The `*.netlify.app` site name for the alias redirect; who owns registrar DNS for the GSC TXT
    record.

---

## Appendix A — Keyword map and proposed titles/descriptions

Validate with Search Console (once live) and a keyword tool before finalising; these are
hypotheses derived from the site's positioning. Primary term first; secondary terms inform H2s
and body copy. Title ≤ 60 chars; description 140–160 chars.

### Existing pages

| Page | Primary / secondary keywords | Proposed `<title>` | Proposed description |
|---|---|---|---|
| `/` | HubSpot consultant; HubSpot Solutions Partner; HubSpot CRM implementation | HubSpot Consultant & CRM Implementation \| PipelineSync *(keep)* | *(keep current, 160 chars)* |
| `/solutions/` | HubSpot implementation services; HubSpot migration; HubSpot CRM cleanup; RevOps consulting | HubSpot Implementation, Migration & Cleanup \| PipelineSync | HubSpot implementation, CRM migration, data cleanup, and RevOps systems from a HubSpot Solutions Partner. Documented builds your team can run. Book a free call. |
| `/integrations/` | HubSpot integrations; HubSpot custom API integration; HubSpot webhooks | HubSpot Integrations & Custom API Development \| PipelineSync *(keep)* | *(keep current, 155 chars)* |
| `/resources/` | HubSpot guides; HubSpot templates; RevOps playbooks | HubSpot Guides, Templates & RevOps Playbooks \| PipelineSync *(keep)* | *(keep current, 149 chars)* |
| `/about/` | PipelineSync; HubSpot Solutions Partner Philippines; HubSpot agency US hours | About PipelineSync \| HubSpot Solutions Partner *(keep; add "Gold" if confirmed)* | PipelineSync is a HubSpot Solutions Partner founded in 2025: a team of eight building CRM, migration, data quality, and RevOps systems for B2B companies. |
| `/about/privacy-policy/` | — | Privacy Policy \| PipelineSync *(keep)* | *(keep)* |
| CRM Architecture Blueprint | HubSpot CRM architecture; HubSpot object model; HubSpot lifecycle stages | HubSpot CRM Architecture Blueprint \| PipelineSync | Structure HubSpot around how your revenue team works: clean objects, clear lifecycle stages, and governance that scales. Free guide from a HubSpot Partner. |
| CRM Cleanup & Dedup System | HubSpot deduplication; HubSpot data cleanup; CRM data quality | HubSpot CRM Cleanup & Deduplication System \| PipelineSync | A step-by-step system to audit, merge, and enrich HubSpot records, then add validation rules that stop duplicates coming back. From a HubSpot Solutions Partner. |
| Lead Routing & Lifecycle Automation | HubSpot lead routing; HubSpot lead rotation; lifecycle stage automation | HubSpot Lead Routing & Lifecycle Automation \| PipelineSync | Build HubSpot lead routing sales trusts: scoring, assignment rules, SLAs, lifecycle automation, and no-lead-left-behind safeguards. Step-by-step guide. |
| Integration Governance & Monitoring | HubSpot integration monitoring; bi-directional sync HubSpot; integration governance | HubSpot Integration Governance & Monitoring \| PipelineSync | Design bi-directional HubSpot integrations with clear ownership, logging, alerts, and rollback so connected systems stay trusted. Governance guide. |
| Full-Funnel Attribution | HubSpot attribution reporting; multi-touch attribution HubSpot; revenue attribution | Full-Funnel Attribution in HubSpot: A Guide \| PipelineSync | Connect first touch to closed-won in HubSpot with campaign influence, multi-touch attribution models, and revenue dashboards leadership can trust. |
| Pipeline doesn't reflect reality | HubSpot pipeline accuracy; HubSpot forecast accuracy; deal stage hygiene | Why Your HubSpot Pipeline Isn't Accurate \| PipelineSync | Stages reps skip, close dates nobody updates, and stale deals: why HubSpot pipelines drift from reality, and the three changes that fix your forecast. |
| Cost of duplicate data | cost of duplicate data CRM; duplicate contacts HubSpot | The Cost of Duplicate Data in HubSpot \| PipelineSync | Where duplicate HubSpot records do real damage: broken reporting, misrouted leads, and rep time lost reconciling data. Plus how to stop duplicates for good. |
| Automation 10 hours | HubSpot automation ideas; HubSpot workflows examples; sales automation HubSpot | HubSpot Automations That Save 10 Hours a Week \| PipelineSync | The HubSpot workflows we build in almost every portal: lead routing, data hygiene, and follow-up automation that gives your team back ten hours a week. |
| Why teams don't adopt | HubSpot adoption; low CRM adoption; HubSpot user adoption | Why Teams Don't Adopt HubSpot & How to Fix It \| PipelineSync | Low HubSpot adoption is usually an architecture problem, not a training problem. The patterns behind it and how we rebuild portals teams actually use. |
| Governance checklist | HubSpot governance; HubSpot permissions best practices; HubSpot naming conventions | HubSpot Governance Checklist (47 Points) \| PipelineSync | A 47-point HubSpot governance checklist covering permissions, validation rules, naming conventions, and audit trails. Free template from PipelineSync. |
| Migration mapping sheet | CRM data migration template; field mapping template; HubSpot migration checklist | CRM Data Migration Mapping Sheet Template \| PipelineSync | A practical field-mapping and QA template for clean CRM migrations to HubSpot: source fields, transformations, owners, and validation steps. |
| Lead routing decision tree | lead routing rules; lead assignment decision tree; HubSpot lead routing template | HubSpot Lead Routing Decision Tree Template \| PipelineSync | A ready-to-build lead routing decision tree for HubSpot: assignment logic, scoring thresholds, SLAs, and escalation paths. Free template from PipelineSync. |

### New pages (Phase 7)

| URL | Primary / secondary keywords | Schema |
|---|---|---|
| `/solutions/hubspot-implementation/` | HubSpot implementation services; HubSpot onboarding partner; HubSpot CRM setup | Service + FAQPage |
| `/solutions/hubspot-migration/` | HubSpot migration services; migrate to HubSpot; CRM migration partner | Service + FAQPage |
| `/solutions/hubspot-migration/salesforce-to-hubspot/` | Salesforce to HubSpot migration; move from Salesforce to HubSpot | Service + FAQPage |
| `/solutions/hubspot-migration/pipedrive-to-hubspot/` | Pipedrive to HubSpot migration | Service + FAQPage |
| `/solutions/hubspot-data-cleanup/` | HubSpot data cleanup services; HubSpot deduplication service; CRM data cleansing | Service + FAQPage |
| `/solutions/revops/` | RevOps consulting; HubSpot RevOps; revenue operations services | Service + FAQPage |
| `/solutions/hubspot-training-and-sops/` | HubSpot training for sales teams; HubSpot SOP documentation; HubSpot adoption program | Service + FAQPage |
| `/integrations/salesforce/`, `/quickbooks/`, `/stripe/`, `/slack/` (+ confirmed others) | HubSpot {tool} integration; sync HubSpot with {tool} | WebPage/TechArticle + FAQPage |
| `/contact/` | contact HubSpot consultant; book HubSpot consultation | ContactPage |
| `/about/allen-trinidad/` | Allen Trinidad HubSpot | Person (ProfilePage) |
| `/case-studies/` + children | HubSpot implementation case study; HubSpot migration case study | CollectionPage / Article |
| `/resources/guides/`, `/resources/articles/`, `/resources/templates/` | HubSpot guides; HubSpot articles; HubSpot templates | CollectionPage + ItemList |

---

## Appendix B — Proposed redirect map (old → new, all 301)

| Old URL | New URL |
|---|---|
| `/resources/crm-cleanup-deduplication-system-pipelinesync/` | `/resources/hubspot-crm-cleanup-deduplication/` |
| `/resources/lead-routing-lifecycle-automation-pipelinesync/` | `/resources/hubspot-lead-routing-lifecycle-automation/` |
| `/resources/integration-governance-monitoring-pipelinesync/` | `/resources/hubspot-integration-governance-monitoring/` |
| `/resources/full-funnel-attribution-that-ceos-trust-pipelinesync/` | `/resources/hubspot-full-funnel-attribution/` |
| `/resources/hubspot-crm-architecture-blueprint/` | *(unchanged)* |
| `/resources/why-your-hubspot-pipeline-doesnt-reflect-reality-pipelinesync/` | `/resources/why-your-hubspot-pipeline-doesnt-reflect-reality/` |
| `/resources/the-cost-of-duplicate-data-in-hubspot-pipelinesync/` | `/resources/cost-of-duplicate-data-in-hubspot/` |
| `/resources/automation-that-saves-10-hours-week-pipelinesync/` | `/resources/hubspot-automation-saves-10-hours-a-week/` |
| `/resources/why-teams-dont-adopt-hubspot-and-how-we-fix-it-pipelinesync/` | `/resources/why-teams-dont-adopt-hubspot/` |
| `/resources/hubspot-governance-checklist-pipelinesync/` | `/resources/hubspot-governance-checklist/` |
| `/resources/data-migration-mapping-sheet-pipelinesync/` | `/resources/crm-data-migration-mapping-sheet/` |
| `/resources/lead-routing-decision-tree-pipelinesync/` | `/resources/hubspot-lead-routing-decision-tree/` |

Also: rewrite every legacy `.html` / percent-encoded WordPress rule in `src/_redirects` to the
**new** URL directly; keep `/feed/*` → `/feed.xml` (after the feed exists); add
`https://<site>.netlify.app/*` → `https://pipelinesync.net/:splat` (301, force).

---

## Appendix C — JSON-LD templates (abbreviated; the partial fills values from data)

**Shared nodes (every page)**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://pipelinesync.net/#organization",
      "name": "PipelineSync",
      "url": "https://pipelinesync.net/",
      "logo": { "@type": "ImageObject", "@id": "https://pipelinesync.net/#logo", "url": "https://pipelinesync.net/assets/img/cropped-logo-only.png", "width": 512, "height": 512 },
      "image": { "@id": "https://pipelinesync.net/#logo" },
      "description": "HubSpot Solutions Partner building CRM, migration, data quality, and RevOps systems for B2B companies.",
      "foundingDate": "2025",
      "founder": { "@id": "https://pipelinesync.net/about/allen-trinidad/#person" },
      "numberOfEmployees": { "@type": "QuantitativeValue", "value": 8 },
      "areaServed": [ { "@type": "Country", "name": "United States" }, { "@type": "Country", "name": "Australia" }, { "@type": "Country", "name": "Canada" }, { "@type": "Country", "name": "United Kingdom" } ],
      "knowsAbout": [ "HubSpot CRM", "CRM implementation", "CRM data migration", "Data deduplication", "Revenue operations", "HubSpot integrations" ],
      "contactPoint": [ { "@type": "ContactPoint", "telephone": "+1-646-729-2936", "contactType": "sales", "areaServed": [ "US", "AU", "CA", "GB" ], "availableLanguage": [ "en" ] } ],
      "sameAs": [ "https://www.linkedin.com/company/pipelinesync", "https://www.upwork.com/agencies/pipelinesync/", "https://www.instagram.com/pipelinesync", "<facebook page URL – CONFIRM>" ]
    },
    { "@type": "WebSite", "@id": "https://pipelinesync.net/#website", "url": "https://pipelinesync.net/", "name": "PipelineSync", "publisher": { "@id": "https://pipelinesync.net/#organization" }, "inLanguage": "en-US" },
    {
      "@type": "Person",
      "@id": "https://pipelinesync.net/about/allen-trinidad/#person",
      "name": "Allen Trinidad",
      "jobTitle": "Founder & HubSpot Solutions Architect",
      "url": "https://pipelinesync.net/about/allen-trinidad/",
      "image": "https://pipelinesync.net/assets/img/allen-headshot.png",
      "worksFor": { "@id": "https://pipelinesync.net/#organization" },
      "knowsAbout": [ "HubSpot CRM", "Revenue operations", "CRM migration", "Data quality" ],
      "sameAs": [ "<LinkedIn profile – CONFIRM>" ]
    }
  ]
}
```

**Per page type (added to the same graph)**

- `WebPage` / `AboutPage` / `CollectionPage` / `ContactPage`: `@id <canonical>#webpage`, `url`,
  `name`, `description`, `isPartOf` → website, `about` → organization, `primaryImageOfPage` → OG
  image, `breadcrumb` → `<canonical>#breadcrumb`, `inLanguage`, `datePublished`, `dateModified`.
- `BreadcrumbList`: `@id <canonical>#breadcrumb`, `itemListElement` of `ListItem` (`position`,
  `name`, `item` absolute URL with trailing slash); last item without `item` is acceptable.
- `TechArticle` (guides) / `BlogPosting` (articles) / `Article` (templates): `@id <canonical>#article`,
  `headline`, `description`, `image` [OG 16:9 (+ 4:3, 1:1 if generated)], `author` → person,
  `publisher` → organization, `datePublished`, `dateModified`, `mainEntityOfPage` →
  `<canonical>#webpage`, `articleSection` (Guides | Articles | Templates), `wordCount`,
  `inLanguage`, `isPartOf` → website, `about` → organization, `keywords` (3–6 terms).
  Templates additionally carry an `ItemList` of the steps/sections.
- `FAQPage`: `@id <canonical>#faq`, `mainEntity` = `Question` (`name`) → `acceptedAnswer`
  `Answer` (`text`, plain text or minimal HTML). Only when the same Q&As are visible on the page.
- `Service` (solutions + sub-pages): `@id <canonical>#service`, `name`, `serviceType`,
  `description`, `provider` → organization, `areaServed`, `url`, `hasOfferCatalog` (hub only)
  with one `Offer` → `Service` per sub-service pointing at its URL. No prices unless public.
- `ItemList` (resources hub + category hubs): generated from the Eleventy collection.
- `ProfilePage` (author page): `mainEntity` → person.

---

## Appendix D — GTM / GA4 event plan

| Event (dataLayer) | Trigger | Parameters | GA4 key event |
|---|---|---|---|
| `page_view` | GA4 config tag (consent-aware) | `page_type` (home/service/guide/article/template/about/contact/404), `author`, `date_modified` via dataLayer push in `base.njk` | — |
| `generate_lead` | HubSpot form `onFormSubmitted` message (`window.addEventListener('message', e => e.data?.type === 'hsFormCallback' && e.data.eventName === 'onFormSubmitted')`) | `form_id`, `form_location` (modal / contact page / guide), `page_path` | **Yes** |
| `cta_click` | Click on `[data-cta]` elements (Book a consultation, Talk to us) | `cta_text`, `cta_location` | — |
| `contact_click` | Click on `tel:`, `wa.me`, `mailto:` links | `channel` (phone/whatsapp/email) | **Yes** |
| `roi_calculator_submit` | ROI calculator calculate action | `monthly_leads_bucket`, `deal_value_bucket` (bucketed, no PII) | **Yes** |
| `resource_card_click` | Click on resource cards | `resource_title`, `resource_type` | — |
| `related_click` | Click in related-content block | `from_slug`, `to_slug` | — |
| `file_download` | Template downloads (enhanced measurement or custom) | `file_name` | — |
| `scroll` 25/50/75/90 | GTM scroll depth on guide/article pages | `percent` | — |
| `outbound_click` | Enhanced measurement | `link_domain` | — |
| `view_404` | Page type 404 | `referrer`, `page_path` | — |

Add `data-cta` attributes in templates where needed. No PII in any parameter. Consent-gate every
tag; verify in GTM Preview + GA4 DebugView; document in `docs/seo/04-tracking-plan.md`.

---

*End of prompt.*
