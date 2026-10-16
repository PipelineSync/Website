/* Glow cursor (fine pointers only).
 * Everywhere on the page the cursor is just a soft, diffuse orange glow (no dot, no ring) that follows the pointer with a
 * short lag (quickTo). Over anything clickable (nav menu, links, buttons, tabs, cards, pipeline
 * deals) the glow fades out and the normal system pointer takes over, so it is always clear what
 * can be clicked; text fields keep the normal text cursor. */
import { gsap, reduced, finePointer } from './env.js';

const NATIVE = 'a, button, [role="tab"], [role="button"], summary, label, select, input, textarea, .deal, .card--link, .mx-card, .mx-list__row, .hs-modal';

export function initCursor() {
  if (!finePointer) return;
  // Switch off site.js's dot + ring cursor completely on this page.
  document.body.classList.remove('cursor-enabled', 'cursor-visible', 'cursor-hover');
  document.querySelectorAll('.cursor-dot, .cursor-ring').forEach((n) => n.remove());
  if (reduced) return; // reduced motion: normal system cursor everywhere

  const glow = document.createElement('div');
  glow.className = 'mx-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);
  document.body.classList.add('mx-glow-on');

  const x = gsap.quickTo(glow, 'x', { duration: 0.18, ease: 'power3' });
  const y = gsap.quickTo(glow, 'y', { duration: 0.18, ease: 'power3' });

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    x(e.clientX); y(e.clientY);
    document.body.classList.add('mx-glow-visible');
  }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    const native = !!(e.target.closest && e.target.closest(NATIVE));
    document.body.classList.toggle('mx-glow-native', native);
  });
  const hide = () => document.body.classList.remove('mx-glow-visible');
  document.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  window.addEventListener('pointerdown', () => glow.classList.add('is-down'));
  window.addEventListener('pointerup', () => glow.classList.remove('is-down'));
}
