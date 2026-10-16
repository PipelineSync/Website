/* Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock. */
import { gsap, ScrollTrigger, reduced } from './env.js';

export function initSmooth() {
  if (reduced || !window.Lenis) return null;
  const lenis = new window.Lenis({ lerp: 0.08, smoothWheel: true, anchors: { offset: -80 } });
  lenis.on('scroll', ScrollTrigger.update);           // keep pinned/scrubbed triggers in step
  gsap.ticker.add((time) => lenis.raf(time * 1000));  // GSAP ticker time is in seconds
  gsap.ticker.lagSmoothing(0);                        // no catch-up jumps after a dropped frame

  // The consultation modal and mobile menu lock the page with body overflow:hidden (site.js).
  // Mirror that into Lenis so the wheel does not scroll the page behind an open dialog.
  new MutationObserver(() => {
    if (document.body.style.overflow === 'hidden') lenis.stop(); else lenis.start();
  }).observe(document.body, { attributes: true, attributeFilter: ['style'] });
  document.querySelectorAll('.hs-modal, #mobileMenu, .roi-modal').forEach((el) => el.setAttribute('data-lenis-prevent', ''));
  return lenis;
}
