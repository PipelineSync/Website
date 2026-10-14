/* PipelineSync measurement: sends conversion events to GA4 (gtag) when it is configured.
   Events are documented in docs/seo/measurement-plan.md. Safe to load without GA4: calls become no-ops. */
(function () {
  'use strict';
  window.dataLayer = window.dataLayer || [];
  var gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  var sent = {};
  function track(name, params, once) {
    if (once && sent[name]) return;
    sent[name] = true;
    gtag('event', name, Object.assign({ page_path: location.pathname }, params || {}));
  }
  window.PipelineSyncTrack = track;

  /* HubSpot cookie banner → Google consent mode (only if the banner is enabled in HubSpot). */
  var _hsp = window._hsp = window._hsp || [];
  _hsp.push(['addPrivacyConsentListener', function (consent) {
    var analytics = consent && consent.categories && consent.categories.analytics;
    gtag('consent', 'update', { analytics_storage: analytics ? 'granted' : 'denied' });
  }]);

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('a, button, [data-card-url]');
    if (!el) return;
    var href = el.getAttribute('href') || '';
    if (el.classList.contains('js-open-hs-form')) track('open_consultation', { cta_text: (el.textContent || '').trim().slice(0, 60) });
    else if (href.indexOf('tel:') === 0) track('click_phone');
    else if (href.indexOf('https://wa.me/') === 0) track('click_whatsapp');
    else if (href.indexOf('mailto:') === 0) track('click_email');
    else if (el.id === 'siteRoiCalc') track('roi_calculated', {}, true);
    else if (el.classList.contains('site-roi-trigger')) track('roi_open', {}, true);
    else if (el.hasAttribute('data-card-url') || (el.closest('.card--link') && href.indexOf('/resources/') === 0)) {
      track('resource_open', { resource_url: el.getAttribute('data-card-url') || href });
    }
  }, true);

  /* Consultation form submissions (HubSpot legacy callback + v4 embed event). */
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (d && d.type === 'hsFormCallback' && d.eventName === 'onFormSubmitted') track('generate_lead', { form_id: d.id || '', method: 'hubspot_form' });
  });
  window.addEventListener('hs-form-event:on-submission:success', function () { track('generate_lead', { method: 'hubspot_form' }); });

  /* Custom events raised by page scripts, e.g. the hero pipeline demo. */
  document.addEventListener('ps:track', function (e) { if (e.detail && e.detail.name) track(e.detail.name, e.detail.params, e.detail.once); });
})();
