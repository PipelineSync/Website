// Per-page motion signatures: scroll reveals for guide pages.
// Marketing pages are handled purely in CSS (page-motion.css keyed off
// body[data-anim]); guide pages use .guide-* classes, so this script tags
// their cards/callouts/checklists with .g-reveal and reveals them on scroll.
(function () {
  'use strict';
  var body = document.body;
  if (!body || !body.getAttribute('data-anim')) return;
  document.documentElement.classList.add('pm-js');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll(
    '.guide-card, .guide-callout, .guide-aside .aside-card, .guide-checklist > li, .guide-footer-cta, .guide-faq details'
  );
  if (!targets.length) return;
  targets.forEach(function (el) { el.classList.add('g-reveal'); });
  if (reduceMotion) {
    targets.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(function (el) { io.observe(el); });
})();
