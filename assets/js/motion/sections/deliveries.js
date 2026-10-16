/* 9. Systems list
 * Reveal: rows stagger in; each row's top border draws left -> right (scaleX 0 -> 1), then its
 * cells slide up out of their masks. Hover (fine pointer, desktop): a floating preview follows the
 * cursor with lerped movement (quickTo, 0.6s), swaps to the row's logo, and the row shifts right. */
import { gsap, ScrollTrigger, EASE, reduced, finePointer, isMobile, $, $$ } from '../env.js';

export function initDeliveries() {
  const sec = $('#mxList');
  if (!sec) return;
  const rows = $$('.mx-list__row:not(.mx-list__row--head)', sec);

  if (!reduced) {
    rows.forEach((row) => {
      gsap.set($('.mx-list__line', row), { scaleX: 0 });
      gsap.set($$('.mx-list__cell > span', row), { yPercent: 110 });
    });
    ScrollTrigger.batch(rows, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => batch.forEach((row, i) => {
        const tl = gsap.timeline({ delay: i * 0.08 });
        tl.to($('.mx-list__line', row), { scaleX: 1, duration: 0.9, ease: EASE.wipe })
          .to($$('.mx-list__cell > span', row), { yPercent: 0, duration: 0.8, ease: EASE.roll, stagger: 0.04 }, '-=0.45');
      })
    });
  }

  const preview = $('.mx-preview');
  if (!preview || reduced || !finePointer) return;
  const img = $('img', preview);
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3' });
  window.addEventListener('mousemove', (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      if (row.dataset.img) img.src = row.dataset.img;
      img.alt = '';
      gsap.to(preview, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
      gsap.to($$('.mx-list__cell', row), { x: 14, duration: 0.5, ease: 'power3.out', stagger: 0.02, overwrite: 'auto' });
    });
    row.addEventListener('mouseleave', () => {
      gsap.to(preview, { opacity: 0, scale: 0.85, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      gsap.to($$('.mx-list__cell', row), { x: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    });
  });
}
