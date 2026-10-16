/* Text splitting: letter-roll characters, scroll-scrubbed words, and the shared reveal helpers.
 *
 * Letter-roll markup per character:
 *   <span class="mx-ch"><span class="mx-ch__in"><span>c</span><span>c</span></span></span>
 * .mx-ch is one line tall with overflow hidden; .mx-ch__in holds the character twice, stacked.
 * Moving .mx-ch__in by yPercent -50 slides the top copy up out of view while the duplicate
 * rises from below. Screen readers get the original text from a visually hidden copy. */
import { gsap, ScrollTrigger, EASE, reduced, finePointer, $$ } from './env.js';

const esc = (c) => c.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const SKIP = new Set(['BR', 'I', 'SVG', 'IMG', 'PICTURE']);

function addSrText(el, text) {
  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = text.replace(/\s+/g, ' ').trim();
  el.appendChild(sr);
}

export function splitChars(el) {
  if (el._mxChars) return el._mxChars;
  const label = el.textContent;
  const chars = [];
  const walk = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3) {
        if (!child.textContent.trim()) return;
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const word = document.createElement('span');
          word.className = 'mx-word';
          word.setAttribute('aria-hidden', 'true');
          for (const c of part) {
            const ch = document.createElement('span');
            ch.className = 'mx-ch';
            ch.innerHTML = `<span class="mx-ch__in"><span>${esc(c)}</span><span>${esc(c)}</span></span>`;
            word.appendChild(ch);
            chars.push(ch.firstChild);
          }
          frag.appendChild(word);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1 && !SKIP.has(child.tagName.toUpperCase()) && !child.classList.contains('sr-only')) {
        walk(child);
      }
    });
  };
  walk(el);
  addSrText(el, label);
  el.classList.add('is-split');
  el._mxChars = chars;
  return chars;
}

/* Entrance roll: the first copy starts invisible, so the visible result is the duplicate sliding up
 * into place, 0.02s apart, expo.out over 0.8s. On complete we swap back to the resting state
 * (first copy visible, yPercent 0), which looks identical and makes hover rolls reusable. */
export function rollIn(el, { delay = 0, stagger = 0.02, duration = 0.8 } = {}) {
  const ins = splitChars(el);
  const firsts = ins.map((i) => i.firstChild);
  const tl = gsap.timeline({
    delay,
    onComplete() {
      gsap.set(ins, { yPercent: 0 });
      gsap.set(firsts, { opacity: 1 });
      el.classList.add('is-rolled');
    }
  });
  tl.set(firsts, { opacity: 0 })
    .fromTo(ins, { yPercent: 0 }, { yPercent: -50, duration, ease: EASE.roll, stagger });
  return tl;
}

/* Scroll-triggered roll for every [data-mx-roll] element (fires once at 80% of the viewport). */
export function initScrollRolls(scope = document) {
  $$('[data-mx-roll]', scope).forEach((el) => {
    if (reduced) return;
    splitChars(el);
    ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: () => rollIn(el) });
  });
}

/* Hover roll for nav links, buttons and footer links: roll up on enter, back down on leave. */
export function hoverRoll(el) {
  if (reduced || !finePointer || el._mxHover) return;
  const target = el.querySelector('[data-roll-label]') || el;
  const ins = splitChars(target);
  el._mxHover = true;
  el.addEventListener('mouseenter', () => gsap.to(ins, { yPercent: -50, duration: 0.55, ease: EASE.roll, stagger: 0.015, overwrite: true }));
  el.addEventListener('mouseleave', () => gsap.to(ins, { yPercent: 0, duration: 0.55, ease: EASE.roll, stagger: 0.015, overwrite: true }));
}

/* Words for the founder paragraph: each word is scrubbed from 20% to 100% opacity. */
export function splitWords(el) {
  const words = [];
  const walk = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span');
          w.className = 'mx-w';
          w.textContent = part;
          frag.appendChild(w);
          words.push(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) walk(child);
    });
  };
  walk(el);
  return words;
}

/* Default reveal for body copy and media: y 40 -> 0, opacity 0 -> 1 at 80% of the viewport,
 * batched so siblings entering together stagger by 0.08s. Reduced motion: opacity only. */
export function initReveals(scope = document) {
  const els = $$('[data-mx-reveal]', scope);
  if (!els.length) return;
  gsap.set(els, reduced ? { opacity: 0 } : { y: 40, opacity: 0 });
  ScrollTrigger.batch(els, {
    start: 'top 80%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: reduced ? 0.6 : 0.9, ease: EASE.reveal, stagger: 0.08, overwrite: true })
  });
}
