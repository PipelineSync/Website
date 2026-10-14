# Performance and Core Web Vitals

Targets (mobile, field data in Search Console): LCP < 2.5 s, INP < 200 ms, CLS < 0.1.

## Changes in the SEO PR

| Change | Where | Effect |
|---|---|---|
| Loading screen lifts on `DOMContentLoaded` (min 450 ms, max 800 ms) instead of `window.load` (min 600 ms, up to 4.5 s) | `assets/js/site.js`, `.loader` transition in `site.css` | Content is visible as soon as HTML is parsed; slow images/third parties no longer keep the page covered. |
| Font Awesome replaced by a self-hosted subset (55 icons) with the solid font preloaded | `assets/vendor/fa/`, `tools/build-icon-subset.py`, `base.njk` | Removes a render-blocking third-party stylesheet; ~250 KB → ~10 KB. |
| Client logos, partner badge and integration logos re-exported at ~3× display size | `tools/optimize-images.py` | Site images 10 MB → 1.3 MB (social cards excluded); largest PNG fallback 1.2 MB → 42 KB. |
| Unused WordPress hero images removed | `assets/img/hero/` | Smaller deploy. |
| HubSpot form embed script loads on first intent (hover/focus/click on a consultation button) | `assets/js/site.js` | One fewer third-party script on every page view. |

Lighthouse before/after numbers are in `audit-baseline.md`.

## Keeping it fast

- **New icons:** add the `fa-*` class in markup, then run `python3 tools/build-icon-subset.py <path-to-fontawesome-free-6.5.2-package>` (instructions in the script header). CI fails if `assets/vendor/fa/icons.css` is missing; a missing glyph shows as an empty box.
- **New images:** add originals via `tools/prepare_images.py`, add a size rule in `tools/optimize-images.py`, keep `width`/`height` on every `<img>` (CI enforces this), `loading="lazy"` below the fold.
- **New third-party scripts:** load with `async`/`defer`, or on intent like the HubSpot form. Add their hosts to the CSP in `netlify.toml`.

## Next steps (not in this PR)

1. After 28 days of traffic, read Search Console → Core Web Vitals (field data) and PageSpeed Insights for `/`, `/solutions/`, `/resources/`.
2. If LCP is still above 2.5 s on mobile: self-host the two Geist weights used above the fold and preload them (removes the Google Fonts round trip), and inline the critical CSS for the hero.
3. Consider limiting the loading screen to the first page view per session (`sessionStorage`). This needs the owner's OK because the screen was a required feature.
4. Switch the CSP header from `Content-Security-Policy-Report-Only` to `Content-Security-Policy` once the deploy preview console shows no violations from HubSpot or GA4.
