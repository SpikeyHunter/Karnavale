<script lang="ts">
	import { onMount } from 'svelte';
	// Header.svelte exists in components/ but is not mounted — same as
	// Produktworld: the hero wordmark (#page-logo) acts as the masthead.
	import Signup from '$lib/components/Signup.svelte';
	import Info from '$lib/components/Info.svelte';
	import Footer from '$lib/components/Footer.svelte';

	// Backgrounds — real asset names:
	//   BG.jpg                  → hero (empty burst — the face is now the live,
	//                             animated KarnavaleVisual composition on top)
	//   BG_KN.jpg               → face baked in (kept for socials / fallbacks)
	//   BG_KN_Lineup.jpg        → faces on the sides, empty centre (future lineup, desktop)
	//   BG_KN_Lineup_Mobile.jpg → portrait, face left (future lineup, mobile)
	// Only the hero is imported for now; the lineup pair comes back with the
	// lineup section's scroll-morph (see Produktworld's HomeContent for ref).
	import bgHero from '$lib/assets/BG.jpg';

	import { isInfoSectionVisible } from '$lib/config';
	import { introComplete } from '$lib/intro';

	let showInfo = $state(false);
	let bgEl = $state<HTMLElement>();

	onMount(() => {
		showInfo = isInfoSectionVisible();

		// The intro assembles the composition on a dark stage; the burst
		// background blooms in behind it only once the sequence hands off.
		let unsub = () => {};
		(async () => {
			const { gsap } = await import('$lib/gsap');
			unsub = introComplete.subscribe((v) => {
				if (!v || !bgEl) return;
				gsap.to(bgEl, { autoAlpha: 1, duration: 1.6, ease: 'power2.inOut' });
			});
		})();

		return () => unsub();
	});
</script>

<div class="site-bg" bind:this={bgEl} aria-hidden="true">
	<!--
	  ⚠ These layers must visually match the Preloader's background layers
	  so the intro → page handoff is a crossfade between identical pixels.
	-->
	<div
		class="bg-layer bg-hero"
		style={`--hero:url(${bgHero})`}
	></div>

	<div class="site-bg-darken"></div>
	<div class="site-bg-vignette"></div>
</div>

<main class="relative z-10">
	<Signup />
	{#if showInfo}
		<Info />
	{/if}
	<Footer />
</main>

<style>
	.site-bg {
		position: fixed;
		inset: 0;
		z-index: 0;

		/* ⚠ Hidden until the intro hands off (gsap fades it in) — the
		   composition assembles on the plain dark stage first. */
		opacity: 0;
		visibility: hidden;
	}
	.bg-layer {
		position: absolute;
		inset: 0;
	}

	/* ── hero ──
	   The burst in BG.jpg radiates from the image centre, and the figure
	   (KarnavaleVisual) is centred at ≈ 42svh in the hero (visual-slot top
	   18svh + half of its 48.9svh height). So instead of background-position
	   percentage games, the layer itself is an oversized, aspect-true plane
	   pinned by its centre to the figure's centre — the rays always converge
	   exactly behind her, at every window size, and scale around that point.
	   Keep --fig-cy in sync with .visual-slot in Signup.svelte. */
	.site-bg {
		--fig-cy: 42svh;
	}
	.bg-hero {
		position: absolute;
		left: 50%;
		top: var(--fig-cy);
		/* big enough to cover the viewport from an off-centre anchor:
		   124svh handles the vertical reach, 60vw guards ultra-wide */
		height: max(124svh, 60vw);
		aspect-ratio: 5120 / 2880; /* BG.jpg's true ratio → no crop drift */
		transform: translate(-50%, -50%);
		background-image: var(--hero);
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	@media (max-width: 767px) {
		.site-bg {
			--fig-cy: 40svh; /* figure sits a touch higher on phones */
		}
	}

	.site-bg-darken {
		position: absolute;
		inset: 0;
		background: rgba(26, 14, 36, 0.38);
	}
	.site-bg-vignette {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse at 50% var(--fig-cy, 42svh),
			transparent 42%,
			rgba(0, 0, 0, 0.78) 100%
		);
	}
</style>
