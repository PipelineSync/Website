/* 2. Hero
 * The live Revenue Pipeline dashboard is the hero visual. It sits below the headline, tilted back
 * in 3D (rotateX) so it reads as a surface receding into the page.
 * Load timeline: see heroIntro below.
 * Scroll timeline (pinned, scrubbed): the copy fades and lifts away while the dashboard flattens to
 * 0deg, scales to fit the viewport and slides up to centre, then holds so it can be used.
 * The dashboard stays fully interactive throughout (drag deals, switch views, add a deal). */
import { gsap, EASE, reduced, $, $$ } from '../env.js';
import { rollIn, splitChars } from '../split.js';

const TILT = 26; // resting tilt in degrees

export function prepareHero() {
  const title = $('#mxHeroTitle');
  if (title && !reduced) splitChars(title); // split early so the first frame shows no raw text
}

/* Intro ("pipeline build"), replacing the loading screen:
 *   0.00  header slides down; the dashboard frame rises in, lifted to just under the header,
 *         nearly flat and scaled to fit, so the whole board is visible while it builds
 *   0.35  window chrome, sidebar items and KPI tiles fade in; KPI amounts count up from $0k
 *   0.50  the four stage columns rise in, one after another
 *   0.75  deal cards drop into their columns one by one (back.out)
 *   1.60  the finished dashboard settles down into its resting 3D tilt below the copy; from 2.0 the
 *         headline letter-rolls in above it, then lead and buttons rise
 * Inline transforms are cleared at the end so home.js (drag, demo, views) owns the board again. */
export function heroIntro() {
  const hero = $('#mxHero');
  if (!hero) return;
  const visual = $('.mx-hero__visual', hero);
  const title = $('#mxHeroTitle');
  const rest = $$('[data-mx-hero-in]', hero);
  const header = $('#siteHeader');

  if (reduced) {
    document.documentElement.classList.remove('mx-intro');
    gsap.to([visual, title, ...rest], { opacity: 1, duration: 0.6, stagger: 0.05 });
    return;
  }
  const chrome = $$('.console__bar, .board__bar, .stage-tabs', hero);
  const side = $$('.console__side-item, .console__side-foot', hero);
  const kpis = $$('.kpi', hero);
  const cols = $$('.board__col', hero);
  const deals = $$('.board__list > .deal, .board__add', hero);
  const inner = [...chrome, ...side, ...kpis, ...cols, ...deals];

  // Count-up for money KPIs ("$486k"): read the target, animate from 0, then restore exact text.
  const counters = $$('.kpi__value', hero)
    .map((el) => ({ el, text: el.textContent, n: parseFloat(el.textContent.replace(/[^0-9.]/g, '')) }))
    .filter((c) => /^\$\d+k$/.test(c.text));

  // site.css gives deals/tiles their own CSS transitions; switch them off while GSAP drives them.
  hero.classList.add('mx-building');
  const tl = gsap.timeline({ onComplete: () => { gsap.set(inner, { clearProps: 'transform,opacity' }); hero.classList.remove('mx-building'); } });
  gsap.set(title, { opacity: 0 });
  if (header) tl.fromTo(header, { y: 0, yPercent: -100 }, { yPercent: 0, duration: 0.9, ease: EASE.roll, clearProps: 'transform' }, 0);
  // Build position: top of the board just under the header, scaled so the whole board fits.
  const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
  const liftY = -(visual.offsetTop - headerH - 28);
  const fitS = Math.min(0.92, (window.innerHeight - headerH - 56) / visual.offsetHeight);
  tl.fromTo(visual, { opacity: 0, y: liftY + 120, rotationX: 18, scale: fitS * 0.94, transformOrigin: '50% 0%' },
      { opacity: 1, y: liftY, rotationX: 6, scale: fitS, duration: 1.1, ease: EASE.roll }, 0)
    .to(visual, { y: 0, rotationX: TILT, scale: 0.92, duration: 1.15, ease: 'power3.inOut' }, 1.6)
    .from(chrome, { opacity: 0, duration: 0.5, stagger: 0.06 }, 0.35)
    .from(side, { opacity: 0, x: -14, duration: 0.5, ease: EASE.reveal, stagger: 0.05 }, 0.4)
    .from(kpis, { opacity: 0, y: 18, duration: 0.6, ease: EASE.reveal, stagger: 0.08 }, 0.45);
  counters.forEach((c, i) => {
    const o = { v: 0 };
    tl.to(o, { v: c.n, duration: 1.1, ease: 'power2.out', onUpdate: () => { c.el.textContent = '$' + Math.round(o.v) + 'k'; }, onComplete: () => { c.el.textContent = c.text; } }, 0.5 + i * 0.08);
  });
  tl.from(cols, { opacity: 0, y: 46, duration: 0.7, ease: EASE.roll, stagger: 0.08 }, 0.5)
    .from(deals, { opacity: 0, y: -26, scale: 0.92, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.06 }, 0.75)
    .set(title, { opacity: 1 }, 2.0)
    .add(rollIn(title, { stagger: 0.018 }), 2.0)
    .fromTo(rest, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: EASE.reveal, stagger: 0.08 }, 2.35);
  // The timeline has now set every starting state inline, so the first-paint hiding can go.
  document.documentElement.classList.remove('mx-intro');
}

export function heroScroll(mm) {
  const hero = $('#mxHero');
  if (!hero || reduced) return;
  const visual = $('.mx-hero__visual', hero);
  const copy = $('.mx-hero__copy', hero);
  const headerH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;

  mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (ctx) => {
    // How far to lift the dashboard so its top sits just under the header, and how much to scale
    // it so the whole board fits in the viewport once flat.
    const lift = () => -(visual.offsetTop - headerH() - 20);
    const fit = () => Math.min(1, (window.innerHeight - headerH() - 40) / visual.offsetHeight);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: ctx.conditions.mobile ? '+=90%' : '+=140%', pin: true, scrub: 1, invalidateOnRefresh: true }
    });
    // autoAlpha (not just opacity) so the faded copy stops catching clicks meant for the dashboard.
    tl.to(copy, { autoAlpha: 0, y: -120, ease: 'power1.in', duration: 0.5 }, 0)
      .to(visual, { rotationX: 0, scale: fit, y: lift, transformOrigin: '50% 0%', ease: 'power2.inOut', duration: 1 }, 0)
      .to({}, { duration: 0.35 }); // hold the flat dashboard before unpinning
  });
}
