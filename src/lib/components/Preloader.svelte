<script lang="ts">
	import { onMount } from 'svelte';
	import { introComplete, stageOpen } from '$lib/intro';

	// ─────────────────────────────────────────────────────────────────────────
	// PRELOADER v2 — a plain dark veil, nothing more.
	// The intro is now staged on the page itself:
	//   1. this veil lifts               → stageOpen = true
	//   2. KarnavaleVisual assembles the composition centre-stage (on dark)
	//   3. its timeline ends             → introComplete = true
	//   4. wordmark fades in above it, BG.jpg blooms behind, copy + Laylo
	//      stagger up (Signup / HomeContent / Footer all listen)
	//   5. scroll unlocks (handled here, on introComplete)
	// ─────────────────────────────────────────────────────────────────────────

	let root = $state<HTMLDivElement>();
	let done = $state(false);

	onMount(() => {
		// ── scroll lock (iOS-compatible fixed-position technique) ─────────────
		document.body.style.position = 'fixed';
		document.body.style.top = '0px';
		document.body.style.width = '100%';
		document.body.style.overflow = 'hidden';

		function unlockScroll() {
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.width = '';
			document.body.style.overflow = '';
			window.scrollTo(0, 0);
		}

		// Unlock + retire the veil once the whole intro sequence is over.
		const unsubIntro = introComplete.subscribe((v) => {
			if (!v) return;
			unlockScroll();
			done = true;
		});

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			// Reduced motion: no staged assembly — open everything at once and
			// let the components do their gentle opacity-only fades.
			stageOpen.set(true);
			if (root) {
				root.style.transition = 'opacity 300ms ease-out';
				root.style.opacity = '0';
			}
			return () => {
				unsubIntro();
				unlockScroll();
			};
		}

		// ── lift the veil ─────────────────────────────────────────────────────
		let tl: any;
		(async () => {
			const { gsap } = await import('$lib/gsap');
			tl = gsap.timeline();
			tl
				// a short beat of black so the page beneath finishes mounting
				.to(root!, { autoAlpha: 0, duration: 0.65, ease: 'power1.inOut' }, 0.35)
				// open the stage just as the veil starts thinning — the first
				// element (the ray circle) blooms THROUGH the fading veil
				.call(() => stageOpen.set(true), [], 0.45);
		})();

		return () => {
			tl?.kill();
			unsubIntro();
			unlockScroll();
		};
	});
</script>

{#if !done}
	<div bind:this={root} class="veil"></div>
{/if}

<style>
	.veil {
		position: fixed;
		inset: 0;
		z-index: 60;
		background: var(--color-darkaccent);
		pointer-events: none;
	}
</style>
