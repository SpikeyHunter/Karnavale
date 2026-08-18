import { writable } from 'svelte/store';

// Holds the single live Lenis instance created in +layout.svelte, so any
// component (nav links, CTA scrolls, etc.) can trigger a smooth scroll
// without recreating Lenis or fighting its physics.
export const lenisStore = writable<any>(null);
