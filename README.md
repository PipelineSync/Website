# PipelineSync website

The PipelineSync website is a static Eleventy project. Shared layouts, navigation, footer markup, metadata, loading screens, HubSpot forms, ROI calculator code, and shared styles are maintained once and compiled to `_site/`.

## Local development

Requirements: Node.js 20 or newer and Python 3 for the optional image preparation script.

```bash
npm install
npm start
```

Eleventy will print a local URL, normally `http://localhost:8080/`. The development server watches `src/` and `assets/`.

Build and run the full deployment check with:

```bash
npm run check
```

`npm run check` builds the site and verifies the expected trailing-slash pages, canonical tags, internal links, local images, and required assets.

## Project structure

- `src/` contains page content, layouts, partials, metadata, `robots.txt`, and the favicon source.
- `src/_includes/layouts/base.njk` is the shared HTML shell.
- `src/_includes/partials/` contains the shared header, footer, loading screen, consultation modal, FAQ, and CTA markup.
- `assets/css/site.css` is the single design system (dark theme tokens, components, page shells, and motion). `hubspot-chat.css` positions the HubSpot chat launcher.
- `assets/js/site.js` handles shared behavior (loader, header, mobile menu, scroll reveals, counters, tabs, card links, consultation modal, cursor). `roi-calculator.js` adds the ROI calculator; `assets/js/pages/` holds page-specific scripts.
- `assets/img/` contains optimized PNG/JPEG assets and WebP siblings.
- `_site/` is generated and should not be edited or committed.

## Adding a resource page

1. Create a directory under `src/resources/` using the desired public slug:

   ```text
   src/resources/my-new-resource/index.njk
   ```

2. Add front matter with the same fields used by an existing resource page. At minimum, set the title, description, canonical URL, and sitemap metadata.
3. Put only the page-specific HTML content below the front matter. Reuse the existing guide classes and partials where appropriate.
4. Add page-specific JavaScript under `assets/js/pages/` only when needed, and reference it with `pageJs` in the front matter.
5. Run `npm run check`. The new page will be included automatically in `sitemap.xml` through the Eleventy collection.

## SEO

- Titles, descriptions and canonicals come from each page's front matter. `pageType` and `breadcrumbName` drive the generated JSON-LD (`buildGraph()` in `.eleventy.js`); business facts, profile links and analytics IDs live in `src/_data/site.json`, services in `src/_data/services.json`, FAQs in `src/_data/faq.json`.
- Social share cards (1200×630) are committed in `assets/img/og/`. After changing a title, run `npm run build && npm run og-images` (needs Playwright with Chromium installed globally).
- `npm run check` also enforces SEO basics: one H1, unique titles/descriptions, `og:image` present, JSON-LD parses with breadcrumbs and article fields, no double-encoded entities, ISO `lastmod` dates. Title/description lengths outside the target range are reported as warnings.
- Plans, audit and owner checklists are in `docs/seo/`.

## Images

`tools/images-to-download.txt` is the image manifest. Run:

```bash
npm run prepare-images
```

The script downloads source images, writes optimized deploy copies to `assets/img/`, and creates WebP versions. Then run `python3 tools/optimize-images.py` to resize logos and badges to their display size. Existing markup uses WebP `<source>` elements with optimized PNG/JPEG fallbacks and includes intrinsic dimensions where available.

## GitHub and Netlify deployment

- `main` is the production branch.
- Netlify should use `npm run build` as the build command and `_site` as the publish directory. These settings are also committed in `netlify.toml`.
- Connect the GitHub repository in Netlify with **Production branch** set to `main`.
- Keep **Deploy Previews** enabled. Netlify automatically creates a preview deploy for every pull request.
- The GitHub Action in `.github/workflows/check-and-preview.yml` runs `npm ci` and `npm run check` on pushes and pull requests.

### Netlify domain settings

In Netlify, open **Site configuration → Domain management → Domains**:

1. Add `pipelinesync.net` as the custom domain.
2. Add `www.pipelinesync.net` as an additional domain.
3. Set `pipelinesync.net` as the **primary domain**. Netlify will redirect `www` to the primary domain once DNS and HTTPS are active.
4. Enable HTTPS / Let’s Encrypt and wait for the certificate to become active.
5. Set the DNS records at the domain registrar to the values Netlify shows. Typically the apex domain uses Netlify DNS or an ALIAS/ANAME record, while `www` uses a CNAME to the Netlify hostname.
6. In **Domain management → HTTPS**, enable **Force HTTPS**. This redirects all `http://` traffic to `https://`.
7. Verify all four variants:
   - `http://pipelinesync.net`
   - `http://www.pipelinesync.net`
   - `https://www.pipelinesync.net`
   - `https://pipelinesync.net`

Do not point the domain at Netlify until the deploy preview has passed `npm run check`.
