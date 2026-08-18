<script lang="ts">
	import { onMount } from 'svelte';

	// ── Information section — hidden for the first draft ────────────────────
	// Toggle via INFO_SECTION_VISIBILITY in $lib/config.ts.
	// The Produktworld version used SplitText char-reveals; those premium
	// plugins aren't wired in this draft (see $lib/gsap.ts), so this is a
	// simpler fade/slide entrance that upgrades cleanly later.

	let section = $state<HTMLElement>();
	let rowsWrap = $state<HTMLElement>();
	let ruleEl = $state<HTMLElement>();

	const rows = [
		{ k: 'Dates', v: '29 — 31 Octobre 2026' },
		{ k: 'Lieu', v: 'New City Gas' },
		{ k: 'Adresse', v: '950 Rue Ottawa, Montréal' },
		{ k: 'Présenté par', v: 'Corona' },
		{ k: 'Programmation', v: 'Dévoilée prochainement' }
	];

	onMount(() => {
		let ctx: any;

		(async () => {
			const { gsap, ScrollTrigger } = await import('$lib/gsap');
			const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (reduced) return;

			ctx = gsap.context(() => {
				const rowEls = Array.from(rowsWrap!.querySelectorAll<HTMLElement>('.row'));
				gsap.set(rowEls, { autoAlpha: 0, y: 18 });
				gsap.set(ruleEl!, { scaleX: 0, transformOrigin: 'left center' });

				gsap
					.timeline({
						scrollTrigger: { trigger: section, start: 'top 65%', once: true }
					})
					.to(ruleEl!, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' })
					.to(
						rowEls,
						{ autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
						'-=0.5'
					);

				ScrollTrigger.refresh();
			});
		})();

		return () => ctx?.revert();
	});
</script>

<section
	id="information"
	bind:this={section}
	class="relative z-10 px-6 md:px-12 py-24 md:py-32 max-w-4xl mx-auto"
>
	<p class="text-lightorange text-xs uppercase mb-2">Informations</p>
	<h2 class="text-beige uppercase leading-none mb-8" style="font-size: clamp(2rem, 6vw, 3.6rem);">
		Le Festival
	</h2>
	<div bind:this={ruleEl} class="h-px bg-beige/25 mb-8"></div>

	<div bind:this={rowsWrap} class="flex flex-col gap-5">
		{#each rows as { k, v }}
			<div class="row flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
				<span class="row-k text-lightorange/90 text-xs uppercase sm:w-44 shrink-0"
					>{k}</span
				>
				<span class="row-v text-beige text-xl md:text-2xl">{v}</span>
			</div>
		{/each}
	</div>
</section>
