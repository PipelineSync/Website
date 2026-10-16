/* Page transitions (multi-page site, so a full navigation happens between them).
 * Leave: a full-screen panel wipes up to cover the screen (yPercent 100 -> 0, 0.7s power4.inOut),
 * then the browser navigates. Arrive: if the previous page set the flag, this page starts covered
 * and the panel continues upward (0 -> -100) to reveal it; the headline then letter-rolls in.
 * A full page load already tears down every ScrollTrigger, and the browser starts the new page at
 * the top. On a back/forward cache restore we reset the panel and refresh triggers.
 * Note: y is zeroed on every set because GSAP reads the CSS translateY(100%) as pixels. */
import { gsap, ScrollTrigger, EASE, reduced, $ } from './env.js';

const KEY = 'mx-wipe';
const store = {
  get() { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } },
  set(v) { try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY); } catch (e) { /* storage blocked */ } }
};

function isInternal(a, e) {
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (a.target && a.target !== '_self') return false;
  if (a.hasAttribute('download') || a.classList.contains('js-open-hs-form')) return false;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return false;
  if (url.pathname === location.pathname && url.hash) return false; // in-page anchor
  return /^https?:$/.test(url.protocol);
}

export function initTransitions() {
  const panel = $('#mxWipe');
  if (!panel) return { arrived: false };
  const arrived = store.get() === '1';
  store.set(null);

  if (arrived && !reduced) {
    gsap.set(panel, { y: 0, yPercent: 0 });
    gsap.to(panel, { yPercent: -100, duration: 0.8, ease: EASE.wipe, delay: 0.05 });
  } else {
    gsap.set(panel, { y: 0, yPercent: 100 });
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!isInternal(a, e) || reduced) return;
    e.preventDefault();
    store.set('1');
    gsap.fromTo(panel, { y: 0, yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: EASE.wipe, onComplete: () => { window.location.href = a.href; } });
  });

  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    gsap.set(panel, { y: 0, yPercent: 100 });
    ScrollTrigger.refresh();
  });
  return { arrived };
}
