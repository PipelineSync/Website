/* 8. Velocity marquee
 * Two rows loop forever in opposite directions. Each frame: base speed + scroll velocity boost,
 * wrapped at -50% (each row holds two identical copies). Skew follows Lenis velocity, clamped
 * to +-8deg and eased back to 0 when scrolling stops. Reduced motion: rows are static. */
import { gsap, reduced, $$ } from '../env.js';

export function initMarquee(lenis) {
  const rows = $$('.mx-marquee__row');
  if (!rows.length || reduced) return;
  const state = rows.map((row) => ({
    inner: row.firstElementChild,
    dir: Number(row.dataset.dir) || 1,
    x: Number(row.dataset.dir) < 0 ? -50 : 0,
    setX: gsap.quickSetter(row.firstElementChild, 'xPercent'),
    setSkew: gsap.quickSetter(row.firstElementChild, 'skewX', 'deg')
  }));
  let skew = 0;
  gsap.ticker.add((time, dt) => {
    const v = lenis ? lenis.velocity : 0;
    const speed = 0.003 + Math.min(Math.abs(v) * 0.0006, 0.03);  // % of row width per ms
    skew += (gsap.utils.clamp(-8, 8, -v * 0.35) - skew) * 0.12;   // lerp toward target skew
    state.forEach((s) => {
      s.x -= s.dir * speed * dt;
      if (s.x <= -50) s.x += 50;
      if (s.x > 0) s.x -= 50;
      s.setX(s.x);
      s.setSkew(skew);
    });
  });
}
