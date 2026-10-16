/* 12. Header, footer and buttons: shared hover letter-roll on text links (icon-only links skipped). */
import { $$ } from '../env.js';
import { hoverRoll } from '../split.js';

export function initChrome() {
  const links = $$('.nav a, .site-footer a, [data-mx-hover]');
  links.forEach((a) => { if (!a.querySelector('svg') && a.textContent.trim()) hoverRoll(a); });
}
