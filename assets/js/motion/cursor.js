/* "Pipeline node" cursor (fine pointers only).
 * The head is the orange node from the PipelineSync mark: a small rounded square that follows the
 * pointer with a very short lerp. Behind it a canvas draws a fading trail through the last ~420ms
 * of positions, thick and bright at the head and thinning to nothing, like data moving through a
 * pipe. Over links and buttons the node opens into a rounded-square outline around the target
 * point. The native cursor is hidden except over text fields. Everything runs on GSAP's ticker. */
import { gsap, reduced, finePointer } from './env.js';

const GROW = 'a, button, [role="tab"], summary, label, .deal, .mx-card, .mx-list__row, [data-cursor]';
const NATIVE = 'input, textarea, select, .hs-modal';
const TRAIL_MS = 420;

export function initCursor() {
  if (!finePointer) return;
  document.body.classList.remove('cursor-enabled', 'cursor-visible', 'cursor-hover'); // site.js cursor off
  if (reduced) return; // reduced motion: keep the native cursor

  const canvas = document.createElement('canvas');
  const node = document.createElement('div');
  canvas.className = 'mx-trail';
  node.className = 'mx-node';
  [canvas, node].forEach((n) => { n.setAttribute('aria-hidden', 'true'); document.body.appendChild(n); });
  document.body.classList.add('mx-node-on');
  const ctx = canvas.getContext('2d');

  let dpr = 1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  const nodeX = gsap.quickTo(node, 'x', { duration: 0.12, ease: 'power3' });
  const nodeY = gsap.quickTo(node, 'y', { duration: 0.12, ease: 'power3' });
  const points = []; // {x, y, t}
  let visible = false;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    nodeX(e.clientX); nodeY(e.clientY);
    points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    if (!visible) { visible = true; document.body.classList.add('mx-node-visible'); }
  }, { passive: true });

  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest ? e.target : null;
    if (!t) return;
    const native = !!t.closest(NATIVE);
    document.body.classList.toggle('mx-node-native', native);
    node.classList.toggle('is-open', !native && !!t.closest(GROW));
  });
  const hide = () => { visible = false; points.length = 0; document.body.classList.remove('mx-node-visible'); };
  document.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  window.addEventListener('pointerdown', () => node.classList.add('is-down'));
  window.addEventListener('pointerup', () => node.classList.remove('is-down'));

  // Trail: segments fade and thin with age; drawn every frame, cleared when idle.
  let drawn = false;
  gsap.ticker.add(() => {
    const now = performance.now();
    while (points.length && now - points[0].t > TRAIL_MS) points.shift();
    if (!points.length) { if (drawn) { ctx.clearRect(0, 0, innerWidth, innerHeight); drawn = false; } return; }
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.lineCap = 'round';
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const life = 1 - (now - b.t) / TRAIL_MS; // 1 at the head, 0 at the tail
      ctx.strokeStyle = `rgba(255, ${Math.round(122 + 49 * (1 - life))}, ${Math.round(26 + 68 * (1 - life))}, ${0.95 * life})`;
      ctx.lineWidth = 1 + 5 * life;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    drawn = true;
  });
}
