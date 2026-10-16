/* 3. Founder intro
 * Portrait and name use the default reveal. The paragraph is split into words; a scrubbed
 * timeline takes each word from 20% to 100% opacity in reading order as the block scrolls
 * through the middle of the viewport. */
import { gsap, reduced, $ } from '../env.js';
import { splitWords } from '../split.js';

export function initFounder() {
  const text = $('[data-mx-words]');
  if (!text) return;
  const words = splitWords(text);
  if (reduced) return; // reduced motion: words stay at full opacity
  gsap.set(words, { opacity: 0.2 });
  gsap.to(words, {
    opacity: 1,
    ease: 'none',
    stagger: 0.1,
    scrollTrigger: { trigger: text, start: 'top 78%', end: 'bottom 45%', scrub: 0.6 }
  });
}
