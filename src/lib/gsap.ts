import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { browser } from '$app/environment';

// ⚠ First-draft build: only core GSAP + ScrollTrigger are registered.
// When the Karnavale intro animation is designed, copy the premium
// plugins folder from Produktworld (src/lib/gsap-bonus/) and re-add:
//
//   import { SplitText } from './gsap-bonus/SplitText.js';
//   import { DrawSVGPlugin } from './gsap-bonus/DrawSVGPlugin.js';
//   import { ScrambleTextPlugin } from './gsap-bonus/ScrambleTextPlugin.js';
//   gsap.registerPlugin(SplitText, DrawSVGPlugin, ScrambleTextPlugin);

if (browser) {
	gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
