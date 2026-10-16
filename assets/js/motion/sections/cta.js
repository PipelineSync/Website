/* 11. Closing CTA: the full-bleed background scales 1.2 -> 1 (scrubbed) across the section's
 * trip through the viewport; the two statement lines roll in via data-mx-roll; the button rolls
 * on hover. */
import { gsap, reduced, $, $$ } from '../env.js';
import { hoverRoll } from '../split.js';

export function initCta() {
  const sec = $('#mxCta');
  if (!sec) return;
  $$('[data-mx-hover]', sec).forEach(hoverRoll);
  if (reduced) return;
  gsap.fromTo($('.mx-cta__img', sec), { scale: 1.2 }, {
    scale: 1,
    ease: 'none',
    scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true }
  });
}
