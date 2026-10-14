# Measurement plan

## Setup

> **Status:** GA4 measurement ID `G-ZYR7TRJ6T8` is set and the HubSpot cookie banner is configured for the consent regions (EU/EEA, UK, Switzerland), confirmed by the owner in Oct 2026. Search Console verification is pending.

- **IDs** live in `src/_data/site.json` under `analytics`: `ga4Id`, `googleSiteVerification`, `bingSiteVerification`. Empty = the tag is not output at all. Prefer DNS (TXT) verification for Search Console; the meta tag is a fallback.
- **GA4** loads from `base.njk` only when `ga4Id` is set, with **Consent Mode v2** defaults:
  - Advertising storage, ad user data and ad personalization: `denied` everywhere (the site runs no ads).
  - `analytics_storage`: `denied` by default for the regions in `analytics.consentRegions` (EU/EEA, UK, Switzerland) and `granted` elsewhere. The owner confirmed the HubSpot cookie banner covers these regions.
  - Consent updates come from **HubSpot's cookie banner** via `_hsp.push(['addPrivacyConsentListener', …])` in `assets/js/analytics.js`. Enable the banner in HubSpot (Settings → Privacy & Consent → Cookies) for the consent regions. Do not add a second banner.
- **Events** are sent by `assets/js/analytics.js` through `gtag('event', …)`. Without GA4 they only fill `window.dataLayer` (harmless), which also makes a later switch to Google Tag Manager straightforward.
- **HubSpot** tracking (`hs-script-loader`) is unchanged and keeps attributing form submissions to original source/UTMs.

## Events

| Event | Fires when | Parameters | GA4 key event? |
|---|---|---|---|
| `generate_lead` | HubSpot consultation form submitted (`hsFormCallback` / `onFormSubmitted` message, or the v4 `hs-form-event:on-submission:success` event) | `method: hubspot_form`, `form_id` (when provided) | **Yes, primary** |
| `open_consultation` | Any "Book a free consultation" button clicked | `cta_text`, `page_path` | Yes, secondary |
| `roi_open` | ROI calculator opened (once per page view) | `page_path` | No |
| `roi_calculated` | "Calculate ROI" pressed (once per page view) | `page_path` | Yes, secondary |
| `click_phone` | `tel:` link clicked | `page_path` | Yes, secondary |
| `click_whatsapp` | `wa.me` link clicked | `page_path` | Yes, secondary |
| `click_email` | `mailto:` link clicked | `page_path` | Yes, secondary |
| `resource_open` | Resource card or its link clicked on `/resources/` | `resource_url` | No |
| `pipeline_demo_interact` | First interaction with the home hero Revenue Pipeline (once per page view) | `page_path` | No |

Register `cta_text`, `resource_url`, `method` as event-scoped custom dimensions in GA4 (Admin → Custom definitions) to report on them.

Page scripts can raise more events without touching `analytics.js`:

```js
document.dispatchEvent(new CustomEvent('ps:track', { detail: { name: 'event_name', params: { key: 'value' }, once: true } }));
```

## Reports to set up

1. **Acquisition → Traffic acquisition** filtered to `generate_lead`: which channels produce consultations.
2. **Landing page** report with `generate_lead` conversion rate: which pages convert.
3. **Search Console linked to GA4** (Admin → Product links): queries and landing pages for organic.
4. **Exploration**: funnel `page_view` → `open_consultation` → `generate_lead` by device.
5. In HubSpot: Contacts by original source and the Attribution report for closed deals, which is the real revenue view.

## Verification after the IDs are added

- Open the site with `?gtm_debug=x` or GA4 DebugView: `page_view` on load, `open_consultation` on button click, `generate_lead` after a test submission (delete the test contact in HubSpot afterwards).
- From a UK/EU location (or a VPN), confirm no `_ga` cookie is set before consent and that it appears after accepting analytics in the HubSpot banner.
