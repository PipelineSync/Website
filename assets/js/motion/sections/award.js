/* 10. Award block: headline lines roll via data-mx-roll; the image is wiped in from left to
 * right (clip-path inset right 100% -> 0) once, when it reaches 75% of the viewport, while the
 * picture inside settles from scale 1.15 to 1 for depth. */
import { gsap, EASE, reduced, $ } from '../env.js';

export function initAward() {
  const media = $('.mx-award__media');
  if (!media) return;
  const pic = $('.mx-award__img', media);
  if (reduced) { gsap.from(media, { opacity: 0, duration: 0.6, scrollTrigger: { trigger: media, start: 'top 80%', once: true } }); return; }
  gsap.set(media, { clipPath: 'inset(0% 100% 0% 0%)' });
  const tl = gsap.timeline({ scrollTrigger: { trigger: media, start: 'top 75%', once: true } });
  tl.to(media, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: EASE.wipe })
    .fromTo(pic, { scale: 1.15 }, { scale: 1, duration: 1.8, ease: 'power3.out' }, 0);
}
