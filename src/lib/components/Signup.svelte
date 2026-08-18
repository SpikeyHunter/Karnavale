<script lang="ts">
	import { onMount } from 'svelte';
	import { introComplete } from '$lib/intro';
	import logo from '$lib/assets/KN_Logo.png';
	import KarnavaleVisual from '$lib/components/KarnavaleVisual.svelte';

	// ── Laylo presale ───────────────────────────────────────────────────────────
	// The presale capture is the ONLY call-to-action for now (no lineup yet).
	// Shown directly — no reveal button. minimal=true keeps it one slim field.
	const LAYLO_DROP_ID = '89cc724f-59b7-460a-accc-d25e5fa00e0f';
	const LAYLO_SRC = `https://embed.laylo.com?dropId=${LAYLO_DROP_ID}&color=FDA719&minimal=true&theme=dark`;

	let logoEl = $state<HTMLImageElement>();
	let content = $state<HTMLDivElement>();

	onMount(() => {
		let unsub = () => {};

		(async () => {
			const { gsap } = await import('$lib/gsap');

			const items = Array.from(content!.children);
			gsap.set(logoEl!, { autoAlpha: 0, y: -18 });
			gsap.set(items, { y: 26, autoAlpha: 0 });

			unsub = introComplete.subscribe((v) => {
				if (!v) return;

				if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
					// Snap position instantly (no animated movement — that's the
					// part reduced motion cares about), fade opacity gently.
					gsap.set(items, { y: 0 });
					gsap.set(logoEl!, { y: 0 });
					gsap.to(logoEl!, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' });
					gsap.to(items, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' });
					return;
				}

				// the wordmark settles in ABOVE the assembled composition…
				gsap.to(logoEl!, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' });

				// …then the copy + Laylo form follow it up
				gsap.to(items, {
					y: 0,
					autoAlpha: 1,
					duration: 0.8,
					stagger: 0.12,
					ease: 'power3.out',
					delay: 0.4
				});
			});
		})();

		return () => unsub();
	});
</script>

<svelte:head>
	<script src="https://embed.laylo.com/laylo-sdk.js"></script>
</svelte:head>

<section id="signup" class="relative min-h-[100svh] overflow-hidden flex flex-col justify-end">
	<!-- bottom gradient so the copy + form always sit on something dark -->
	<div
		class="absolute inset-x-0 bottom-0 h-[55svh] -z-10 pointer-events-none"
		style="background: linear-gradient(to top,
			rgba(26, 14, 36, 0.95) 0%,
			rgba(26, 14, 36, 0.55) 70%,
			rgba(26, 14, 36, 0) 100%);"
	></div>

	<!-- KARNAVALE wordmark — the Preloader's logo lands exactly here -->
	<img
		id="page-logo"
		bind:this={logoEl}
		src={logo}
		alt="Karnavale — Festival de l'Halloween"
		class="page-logo absolute left-1/2 -translate-x-1/2"
		style="opacity:0"
	/>

	<!-- ── the animated Karnavale composition — fills the middle of the hero ── -->
	<div class="visual-slot absolute inset-x-0 flex justify-center z-[5] pointer-events-none">
		<KarnavaleVisual />
	</div>

	<div
		bind:this={content}
		class="w-full flex flex-col items-center gap-1 px-6 text-center z-10"
		style="padding-bottom: clamp(16px, 3.2svh, 44px);"
	>
		<p class="text-beige uppercase" style="font-size: clamp(11px, 2.1svh, 21px);">
			30 et 31 Octobre 2026
		</p>
		<!-- whitespace-nowrap + a vw-driven floor keeps the title on ONE line
		     at every width: ~13.5 chars wide in Victor Serif → 6.4vw always fits,
		     even on a 320px phone (title ≈ 296px). -->
		<h1
			class="font-black text-beige leading-none uppercase whitespace-nowrap"
			style="font-size: min(6.4vw, clamp(1.5rem, 5svh, 3.6rem));"
		>
			Festival de l'Halloween
		</h1>

		<!-- ── presale — the compact Laylo field, shown directly ── -->
		<div class="w-full mt-3" style="max-width: min(440px, 80vw, 52svh);">
			<iframe
				id="laylo-drop-{LAYLO_DROP_ID}"
				class="laylo-embed"
				title="Karnavale — Inscription prévente"
				frameborder="0"
				scrolling="no"
				allow="web-share"
				allowtransparency={true}
				style="width: 1px; min-width: 100%; max-width: 1000px;"
				src={LAYLO_SRC}
			></iframe>
		</div>
	</div>
</section>

<style>
	.page-logo {
		top: clamp(8px, 2.5svh, 24px);
		/* vw caps narrow windows, svh scales with window height, px is the
		   ceiling on very large displays */
		width: min(62vw, 50svh, 560px);
		z-index: 6; /* wordmark reads above the composition */
	}

	/*
	  The composition sits between the wordmark (top) and the copy + Laylo
	  form (bottom). Width is svh-driven so the full figure — papel picado
	  included — stays visible on any screen (height ≈ width × 1.222).
	*/
	/*
	  Sizing contract: composition bottom must clear the copy block.
	  top ≈ 15svh, height = width × 1.222 → with 38svh width the figure ends
	  around 61svh, leaving the bottom third for date / title / Laylo.
	*/
	.visual-slot {
		/* centres the figure in the band between wordmark bottom (~17svh)
		   and the date line (~70svh) — figure height = width × 1.222 */
		top: clamp(96px, 18svh, 220px);
	}
	.visual-slot :global(.visual) {
		width: min(66vw, 40svh);
	}
	/* Phones: a touch wider, same clearance logic. */
	@media (max-width: 767px) {
		.visual-slot {
			top: clamp(96px, 18svh, 180px);
		}
		.visual-slot :global(.visual) {
			width: min(76vw, 35svh);
		}
	}

	/*
	  Subtle glass card behind the Laylo embed so the form blends into the
	  poster art instead of floating raw on top of it.
	*/

</style>
