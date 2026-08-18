import { writable } from 'svelte/store';

/** The dark veil has lifted — the stage is visible, the composition may assemble. */
export const stageOpen = writable(false);

/** The intro sequence is fully done — page content may animate in, scroll unlocks. */
export const introComplete = writable(false);
