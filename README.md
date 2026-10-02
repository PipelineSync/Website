# PipelineSync website

The PipelineSync marketing website is a plain static site: hand-maintained HTML
pages, self-contained styles and scripts (inline per page), images in `images/`,
and a HubSpot AI chatbot embed on every page.

## Structure

- 18 top-level pages (e.g. `index.html`, `about.html`, `solutions.html`) plus
  matching `<slug>/index.html` copies so clean trailing-slash URLs work on any
  static host with zero redirect config — 34 HTML files total.
- `images/` — logos, badges, and page imagery.
- `robots.txt`, `sitemap.xml` — SEO files; sitemap uses clean trailing-slash URLs.
- `netlify.toml` — static publish from the repo root, no build step.

## Local preview

Any static server works, e.g.:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Checks

CI runs the same check on every PR to `main`:

```bash
python3 tools/check_static.py
```

It verifies every internal `href`/`src` across all pages resolves to a real file
and that every `<loc>` in `sitemap.xml` maps to a page. No dependencies beyond
Python 3.

## Editing a page

Edit the top-level `<page>.html` **and** its `<page>/index.html` copy together —
they are the same page in two URL forms. Keep `sitemap.xml` in sync when adding
or renaming pages.
