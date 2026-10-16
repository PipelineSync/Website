# SEO audit: baseline (October 2026)

Scope: all 19 built pages on `main` after the redesign (merge of PR #14), crawled from `_site/`, plus Lighthouse 12.2.1 (mobile emulation, simulated throttling) on `/`, `/solutions/`, `/resources/` and one guide. Lighthouse ran against a local static server inside a sandbox that blocks some third-party hosts, so absolute timings are pessimistic (no compression, slow proxy for Google Fonts) and "Best practices" is lowered by the sandbox (HTTP, blocked HubSpot requests). Use the relative changes, and re-measure on the Netlify deploy preview and in Search Console's Core Web Vitals report.

## Priority findings

| # | Priority | Finding | Status in this PR |
|---|---|---|---|
| 1 | P0 | Two guide titles double-encoded (`Integration Governance &amp;amp; Monitoring`, `Lead Routing &amp;amp; Lifecycle Automation`) in `<title>` and `og:title`. | Fixed at the source; CI now fails on `&amp;amp;`. |
| 2 | P0 | `og:image` pointed to `https://pipelinesync.net/pipelinesync_logo_transparent.png`, a file that is not in the repo (left over from WordPress). Resource pages had no `og:image` at all. | Fixed: a 1200×630 card for every page in `assets/img/og/`, plus `og:image:width/height/alt`, `twitter:image`. |
| 3 | P0 | No structured data on the 12 resource pages, no BreadcrumbList anywhere, inconsistent `@id`s (`/about#webpage` vs `/about/`), logo URL in Organization 404s. | Fixed: one generated `@graph` per page (see `structured-data.md`). |
| 4 | P1 | Sitemap `lastmod` hard-coded to `2026-10-03` on every URL. | Fixed: real git commit dates; `changefreq`/`priority` dropped (Google ignores them). |
| 5 | P1 | No Google Search Console / Bing verification, no GA4, no conversion events. | Scaffolded: IDs in `src/_data/site.json`, consent mode v2, event tracking (`measurement-plan.md`). Owner must add IDs. |
| 6 | P1 | Loading screen stayed up until `window.load` (min 600 ms, up to 4.5 s), hiding content and delaying paint metrics. | Fixed: lifts on `DOMContentLoaded`, 450 ms minimum, 800 ms cap. The screen itself is kept (required feature). |
| 7 | P1 | Font Awesome loaded as the full 100 KB stylesheet + ~150 KB fonts from cdnjs (render-blocking third party) for 55 icons. | Fixed: self-hosted subset, 3 KB CSS + 7 KB fonts, preloaded. |
| 8 | P1 | Client logo PNG fallbacks up to 1.2 MB and 2,000 px wide, shown at 44 px tall; partner badge 1 MB. | Fixed: re-exported at ~3× display size (`tools/optimize-images.py`); site images 10 MB → 1.3 MB (plus 2.8 MB of new social cards that only social platforms fetch), unused WordPress hero images removed. |
| 9 | P1 | Guide pages used `href="javascript:void(0)"` for the consultation CTA (Lighthouse SEO "links are not crawlable", guide SEO score 92). | Fixed: real `<button>` elements; SEO score 100. |
| 10 | P1 | Resource meta descriptions 67–138 characters; `/solutions/` and `/about/` over 160. | Proposed in `keyword-map.md` (awaiting approval). CI warns on length. |
| 11 | P2 | Home H1 is the slogan with no target keyword. | Two options proposed in `keyword-map.md`. |
| 12 | P2 | Only `/icon.png`; no `favicon.ico`, `apple-touch-icon`, or web manifest. | Fixed. |
| 13 | P2 | No security headers beyond caching. | Added `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, and a report-only CSP. |
| 14 | P2 | HubSpot form embed script loaded on every page view. | Now loaded on first intent (hover/focus/click on a consultation button). |
| 15 | P2 | Privacy policy is WordPress boilerplate (comments, Gravatar) and does not mention HubSpot tracking, analytics, or cookies. | Draft for legal review in `privacy-policy-draft.md`; live page unchanged. |
| 16 | P2 | Resource pages are 350–450 words; template pages do not link to the actual template files. | Content refresh plan in `content-plan.md` §6; template files are `TODO(owner)`. |
| 17 | P3 | No author bylines/dates on articles. | Dates now in schema and `article:*` meta; visible byline "By the PipelineSync team" plus Updated date on every resource page (Oct 2026). |

## Per-page snapshot (before)

| URL | Title chars | Description chars | H1 | JSON-LD |
|---|---|---|---|---|
| `/` | 54 | 160 | Make the CRM work like the business. | Organization, WebSite, WebPage |
| `/solutions/` | 62 | 175 | HubSpot built around how your team actually works | Organization, WebSite, WebPage, Service |
| `/integrations/` | 60 | 155 | Connect HubSpot to the tools your team already uses | Organization, WebSite, WebPage, Service |
| `/resources/` | 59 | 149 | HubSpot guides, templates, and playbooks | Organization, WebSite, CollectionPage, ItemList |
| `/about/` | 46 | 165 | We build HubSpot systems teams actually use | Organization, WebSite, AboutPage |
| `/about/privacy-policy/` | 29 | 136 | Privacy Policy | none |
| 12 resource pages | 41–61 | 67–138 | matches title | none |

Every page had exactly one H1, a self-referencing canonical, and `index, follow` (404 is `noindex, follow`). Internal links and image dimensions were already validated by `npm run check`.

## Lighthouse (mobile, sandbox): before → after this PR

| Page | Performance | SEO | LCP | Speed Index | TBT | Transfer |
|---|---|---|---|---|---|---|
| `/` | 79 → 86 | 100 → 100 | 3.5 s → 3.1 s | 5.8 s → 5.0 s | 180 ms → 0 ms | 619 KB → 342 KB |
| `/solutions/` | 87 → 88 | 100 → 100 | 2.9 s → 2.9 s | 5.1 s → 4.9 s | 0 → 0 | 232 KB → 262 KB* |
| `/resources/` | 87 → 87 | 100 → 100 | 2.9 s → 3.0 s | 5.0 s → 5.0 s | 0 → 0 | 234 KB → 263 KB* |
| HubSpot CRM Architecture Blueprint | 88 → 88 | 92 → 100 | 2.9 s → 2.9 s | 4.8 s → 4.8 s | 0 → 0 | 219 KB → 248 KB* |

\* "Before" did not count Font Awesome at all because the sandbox blocks cdnjs; "after" counts the self-hosted subset (~10 KB) and the HubSpot logo images. On real connections the after state is ~240 KB lighter per page than before.

Accessibility stayed at 100 on all four pages.
