/* 5. Before / after (pinned, scrubbed)
 * Phase 1: the messy spreadsheet breaks apart. Every cell flies off on its own random vector,
 * rotates and fades, row by row from the top, while the "Before" label lifts away.
 * Phase 2 (overlapping): the pipeline columns rise in, then each deal card drops into its column,
 * and the "After" label slides up. A short hold on the clean board ends the scene.
 * Random vectors come from a seeded generator so the motion is identical on every visit. */
import { gsap, reduced, $, $$ } from '../env.js';

function seeded(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

export function initShift(mm) {
  const sec = $('#mxShift');
  if (!sec) return;
  if (reduced) { sec.classList.add('is-static'); return; }
  const cells = $$('.mx-sheet__cell', sec);
  const cols = $$('.mx-board__col', sec);
  const cards = $$('.mx-board__card', sec);
  const labelA = $('[data-shift-label="a"]', sec), labelB = $('[data-shift-label="b"]', sec);

  mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (ctx) => {
    const rand = seeded(7);
    const spread = ctx.conditions.mobile ? 160 : 420;
    gsap.set(cols, { opacity: 0, y: 80 });
    gsap.set(cards, { opacity: 0, y: -50, scale: 0.9 });
    gsap.set(labelB, { opacity: 0, yPercent: 60 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sec, start: 'top top', end: ctx.conditions.mobile ? '+=130%' : '+=200%', pin: true, scrub: 1 }
    });
    tl.to(cells, {
      x: () => (rand() - 0.5) * spread * 2,
      y: () => (rand() - 0.5) * spread,
      rotation: () => (rand() - 0.5) * 50,
      opacity: 0,
      ease: 'power2.in',
      duration: 0.6,
      stagger: { each: 0.006, from: 'start' }
    }, 0)
      .to(labelA, { opacity: 0, yPercent: -60, duration: 0.35 }, 0.1)
      .to(cols, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.08 }, 0.55)
      .to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.6)', stagger: 0.07 }, 0.8)
      .to(labelB, { opacity: 1, yPercent: 0, duration: 0.4, ease: 'power3.out' }, 0.85)
      .to({}, { duration: 0.35 });
    return () => gsap.set([...cells, ...cols, ...cards, labelA, labelB], { clearProps: 'all' });
  });
}
