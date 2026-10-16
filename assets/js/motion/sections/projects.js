/* 7. Services track (horizontal scroll while pinned, desktop only)
 * The track moves left by its overflow width, scrubbed 1:1 with a pin of the same length.
 * Each card image gets inner parallax (xPercent -10 -> 10) via containerAnimation, so it is
 * timed to the card's own trip across the viewport. Under 768px cards simply stack. */
import { gsap, reduced, $, $$ } from '../env.js';

export function initProjects(mm) {
  const sec = $('#mxWork');
  if (!sec || reduced) return;
  const track = $('.mx-work__track', sec);
  mm.add('(min-width: 768px)', () => {
    const distance = () => track.scrollWidth - document.documentElement.clientWidth;
    const move = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + distance(), pin: true, scrub: 1, invalidateOnRefresh: true }
    });
    $$('.mx-card', track).forEach((card) => {
      const img = $('.mx-card__img', card);
      gsap.fromTo(img, { xPercent: -10 }, {
        xPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: move, start: 'left right', end: 'right left', scrub: true }
      });
    });
  });
}
