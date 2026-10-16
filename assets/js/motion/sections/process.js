/* 6. Process steps 01-04 (pinned ~400vh desktop, ~200vh mobile)
 * Scroll progress picks the active step. On each change: the label roller slides to the new
 * value (expo.out), the outgoing step slides up and fades, the incoming one rises in.
 * The thin progress bar is scrubbed directly from the trigger progress. */
import { gsap, ScrollTrigger, EASE, reduced, $, $$ } from '../env.js';

export function initProcess(mm) {
  const sec = $('#mxProcess');
  if (!sec) return;
  const steps = $$('.mx-step', sec);
  const roller = $('.mx-roller__list', sec);
  const bar = $('.mx-process__bar i', sec);
  if (reduced) { sec.classList.add('is-static'); return; }

  mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (ctx) => {
    let current = -1;
    gsap.set(steps, { opacity: 0, y: 40 });
    const show = (i) => {
      if (i === current) return;
      const dir = i > current ? 1 : -1;
      if (current > -1) gsap.to(steps[current], { opacity: 0, y: -40 * dir, duration: 0.5, ease: 'power2.in', overwrite: true });
      gsap.fromTo(steps[i], { opacity: 0, y: 40 * dir }, { opacity: 1, y: 0, duration: 0.8, ease: EASE.roll, delay: current > -1 ? 0.15 : 0, overwrite: true });
      gsap.to(roller, { yPercent: (-100 / steps.length) * i, duration: 0.9, ease: EASE.roll, overwrite: true });
      current = i;
    };
    show(0);
    ScrollTrigger.create({
      trigger: sec,
      start: 'top top',
      end: ctx.conditions.mobile ? '+=200%' : '+=400%',
      pin: true,
      scrub: true,
      onUpdate(self) {
        gsap.set(bar, { scaleX: self.progress });
        show(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)));
      }
    });
    return () => { current = -1; gsap.set(steps, { clearProps: 'all' }); };
  });
}
