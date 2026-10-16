/* Shared motion environment: GSAP globals (loaded as classic scripts before this module), breakpoints, flags. */
export const gsap = window.gsap;
export const ScrollTrigger = window.ScrollTrigger;
gsap.registerPlugin(ScrollTrigger);

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
export const MOBILE = '(max-width: 767px)';
export const isMobile = () => window.matchMedia(MOBILE).matches;

// Shared easing vocabulary so every section feels like the same system.
export const EASE = { roll: 'expo.out', reveal: 'power3.out', wipe: 'power4.inOut' };
export const $ = (sel, ctx = document) => ctx.querySelector(sel);
export const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
