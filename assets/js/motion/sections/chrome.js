/* 12. Footer links and buttons: shared hover letter-roll on text links (icon-only links skipped).
 * The nav menu roll lives in site.js so it works on every page. */
import { $$ } from '../env.js';
import { hoverRoll } from '../split.js';

export function initChrome() {
  const links = $$('.site-footer a, [data-mx-hover]');
  links.forEach((a) => { if (!a.querySelector('svg') && a.textContent.trim()) hoverRoll(a); });
}
