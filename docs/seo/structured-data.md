# Structured data

All JSON-LD is generated at build time by `buildGraph()` in `.eleventy.js` and output once per page by the `{% jsonld %}` shortcode in `src/_includes/layouts/base.njk`. Pages no longer carry hand-written `schema:` front matter. Business facts come from data files, so they are defined once:

| Source | Feeds |
|---|---|
| `src/_data/site.json` | Organization / ProfessionalService, founder Person, WebSite, `sameAs`, `areaServed`, contact point, analytics IDs |
| `src/_data/services.json` | Service entities and the Organization's OfferCatalog |
| `src/_data/faq.json` | The visible FAQ (`partials/faq.njk`) **and** FAQPage, so the two can never drift apart |
| Page front matter: `pageType`, `breadcrumbName`, `title`, `description`, `tags: resource` | WebPage type, BreadcrumbList, Article/BlogPosting, ItemList |
| Git history | `datePublished` (first commit) and `dateModified` (last commit); override with `datePublished` / `dateModified` front matter |

## Entity map (stable `@id`s)

| `@id` | Type | On |
|---|---|---|
| `https://pipelinesync.net/#organization` | Organization + ProfessionalService | every page |
| `https://pipelinesync.net/#founder` | Person (Allen Trinidad) | every page |
| `https://pipelinesync.net/#website` | WebSite | every page |
| `https://pipelinesync.net/#logo` | ImageObject (`/assets/img/brand/pipelinesync-logo-512.png`) | every page |
| `{url}#webpage` | WebPage / AboutPage / CollectionPage | every page except 404 |
| `{url}#breadcrumb` | BreadcrumbList | every page except home and 404 |
| `https://pipelinesync.net/solutions/#{service-id}` | Service (8) | home, `/solutions/` |
| `https://pipelinesync.net/solutions/#custom-integrations` | Service | `/integrations/` |
| `{url}#faq` | FAQPage | home (5 Q&As), `/resources/` (7 Q&As) |
| `https://pipelinesync.net/resources/#resource-list` | ItemList of the 12 resources | `/resources/` |
| `{url}#article` | Article (guides, templates) / BlogPosting (articles) | 12 resource pages |

`pageType` values: `home`, `services`, `integrations`, `collection`, `about`, `page`, `guide`, `article`, `template`, `none` (no JSON-LD; used by 404).

## Deliberate choices

- **No Review / AggregateRating markup.** Google treats self-serving reviews of your own business as ineligible; the 10 five-star reviews stay as visible text linking to the source profiles.
- **Author is the Organization** on articles until the owner confirms who wrote each piece. Once confirmed, change `author` in `buildGraph()` (or add `author` front matter) to the Person and add a visible byline.
- **City-level address only.** `address` is Clark, Pampanga, PH, matching the public HubSpot directory listing; no street address. `areaServed` lists US, AU, CA, GB.
- **FAQPage** is valid markup; Google currently shows FAQ rich results mainly for authoritative government/health sites, but other engines and AI answers use it.
- **No SearchAction** (the site has no search).

## Owner inputs that improve the graph

- Done: `hubspotDirectoryUrl` (public directory URL, confirmed by the owner) and `founder.sameAs` (Allen's LinkedIn).
- Still useful: any Clutch/G2 profile URLs (append to `sameAs`).

## Validation

- `npm run check` parses every block, requires `@context`, a BreadcrumbList on non-home pages, `headline`/`datePublished`/`dateModified`/`author`/`publisher`/`image` on Article/BlogPosting, and checks each FAQ question is visible on the page.
- After deploy, test these in [Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/): `/`, `/solutions/`, `/resources/`, `/about/`, `/resources/hubspot-crm-architecture-blueprint/`, `/resources/why-your-hubspot-pipeline-doesnt-reflect-reality-pipelinesync/`. Then watch Search Console → Enhancements (Breadcrumbs, FAQ).
