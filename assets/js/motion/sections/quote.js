/* 4. Pull quote: each line letter-rolls when it reaches 80% of the viewport (data-mx-roll handles
 * the trigger); the button uses the shared hover roll. Nothing extra to scrub here. */
import { $$ } from '../env.js';
import { hoverRoll } from '../split.js';

export function initQuote() {
  $$('.mx-quote [data-mx-hover]').forEach(hoverRoll);
}
