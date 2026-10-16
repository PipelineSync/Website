/* Motion preview entry point.
 * Order matters for ScrollTrigger: pinned sections are created top to bottom so each pin's
 * spacing is accounted for by the triggers below it. Everything that depends on layout is
 * created after fonts are ready, then refreshed once the preloader has lifted. */
import { gsap, ScrollTrigger, reduced } from './env.js';
import { initSmooth } from './smooth.js';
import { initReveals, initScrollRolls } from './split.js';
import { initTransitions } from './transitions.js';
import { initCursor } from './cursor.js';
import { prepareHero, heroIntro, heroScroll } from './sections/hero.js';
import { initFounder } from './sections/founder.js';
import { initQuote } from './sections/quote.js';
import { initShift } from './sections/shift.js';
import { initProcess } from './sections/process.js';
import { initProjects } from './sections/projects.js';
import { initMarquee } from './sections/marquee.js';
import { initDeliveries } from './sections/deliveries.js';
import { initAward } from './sections/award.js';
import { initCta } from './sections/cta.js';
import { initChrome } from './sections/chrome.js';

document.documentElement.classList.add('mx-ready');
if (reduced) document.documentElement.classList.add('mx-reduced');
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const { arrived } = initTransitions();
initCursor();
const lenis = initSmooth();
window.mxLenis = lenis; // handy for debugging in the console
prepareHero();

const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
fontsReady.then(() => {
  const mm = gsap.matchMedia();
  // Scroll scenes, in page order.
  heroScroll(mm);
  initFounder();
  initQuote();
  initShift(mm);
  initProcess(mm);
  initProjects(mm);
  initMarquee(lenis);
  initDeliveries();
  initAward();
  initCta();
  initScrollRolls();
  initReveals();
  initChrome();

  // No preloader: the hero builds itself in. After a page transition the wipe panel lifts first.
  gsap.delayedCall(arrived ? 0.35 : 0, heroIntro);
  ScrollTrigger.refresh();
});
window.addEventListener('load', () => ScrollTrigger.refresh());
