<script lang="ts">
	import { onMount } from 'svelte';
	import { introComplete, stageOpen } from '$lib/intro';

	// ── layer art (exact filenames from src/lib/assets/elements/) ─────────────
	import imgCircle from '$lib/assets/elements/BACK_CIRCLE.png';
	import imgMoonL from '$lib/assets/elements/MOON_1.png';
	import imgMoonR from '$lib/assets/elements/MOON_2.png';
	import imgLinesL from '$lib/assets/elements/SIDE_LINES - 1.png';
	import imgLinesR from '$lib/assets/elements/SIDE_LINES - 2.png';
	import imgFrida from '$lib/assets/elements/FRIDA_FACE+BODY.png';
	import imgFaceFlowers from '$lib/assets/elements/FACE_FLOWERS.png';
	import imgSideFlowerL from '$lib/assets/elements/SIDe_FLOWER_1.png';
	import imgSideFlowerR from '$lib/assets/elements/SIDe_FLOWER_2.png';
	import imgBodyFlower from '$lib/assets/elements/BODY_FOWER_1.png';
	import imgRedFlower from '$lib/assets/elements/BODY_FOWER_2.png';
	import imgDownBar from '$lib/assets/elements/DOWN_BAR.png';

	// ── layout ─────────────────────────────────────────────────────────────────
	// Straight from the Figma export (frame 4571.11 × 5585.90), converted to
	// percentages and VERIFIED by re-rendering the composition offline against
	// Visual_Element.png — it's a match. Tweak any number here to nudge a layer.
	//
	// ⚠ FLIP ARCHITECTURE — the mirror lives on the INNER <img> (plain CSS),
	// while GSAP only ever animates the OUTER wrapper. Before, both lived on
	// one element: GSAP read the -1 scale into its own transform state, so the
	// right-side flowers un-flipped / jumped mid-tween ("moved too much") and
	// the sway on the untouched left ones was too subtle to register. Wrapper
	// + inner img keeps the two transforms completely independent.
	interface Layer {
		id: string;
		src: string;
		x: number;
		y: number;
		w: number;
		o?: number; // resting opacity (Figma: moons .91, eyes .92)
		flip?: boolean;
		anim: 'circle' | 'moon' | 'lines-l' | 'lines-r' | 'frida' | 'eyes' | 'bloom' | 'bar';
		z: number;
	}

	const LAYERS: Layer[] = [
		{ id: 'circle',        src: imgCircle,      x: 4.691,  y: 7.164,  w: 90.585, anim: 'circle',  z: 1 },
		{ id: 'lines-l',       src: imgLinesL,      x: 5.880,  y: 72.831, w: 22.336, anim: 'lines-l', z: 2 },
		{ id: 'lines-r',       src: imgLinesR,      x: 70.598, y: 72.831, w: 22.336, flip: true, anim: 'lines-r', z: 2 },
		{ id: 'moon-l',        src: imgMoonL,       x: 9.514,  y: 44.336, w: 48.532, o: 0.91, anim: 'moon', z: 3 },
		{ id: 'moon-r',        src: imgMoonR,       x: 41.856, y: 44.336, w: 48.532, o: 0.91, anim: 'moon', z: 3 },
		{ id: 'frida',         src: imgFrida,       x: 2.841,  y: 0,      w: 94.351, anim: 'frida',   z: 4 },
		{ id: 'side-flower-l', src: imgSideFlowerL, x: 5.880,  y: 56.394, w: 20.910, anim: 'bloom',   z: 5 },
		{ id: 'side-flower-r', src: imgSideFlowerR, x: 70.598, y: 58.638, w: 20.974, anim: 'bloom',   z: 5 },
		{ id: 'body-flower-l', src: imgBodyFlower,  x: 17.046, y: 71.343, w: 14.668, anim: 'bloom',   z: 6 },
		{ id: 'body-flower-r', src: imgBodyFlower,  x: 68.451, y: 71.343, w: 14.668, flip: true, anim: 'bloom', z: 6 },
		{ id: 'red-flower-l',  src: imgRedFlower,   x: 9.514,  y: 79.129, w: 8.094,  anim: 'bloom',   z: 7 },
		{ id: 'red-flower-r',  src: imgRedFlower,   x: 79.088, y: 79.129, w: 8.094,  flip: true, anim: 'bloom', z: 7 },
		{ id: 'face-flowers',  src: imgFaceFlowers, x: 33.895, y: 37.253, w: 32.276, o: 0.92, anim: 'eyes', z: 8 },
		{ id: 'down-bar',      src: imgDownBar,     x: 0,      y: 88.618, w: 100,    anim: 'bar',     z: 9 }
	];

	let root = $state<HTMLDivElement>();

	onMount(() => {
		let unsub = () => {};
		let ctx: any;
		let played = false;

		(async () => {
			const { gsap } = await import('$lib/gsap');
			const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

			const q = (sel: string) => root!.querySelectorAll<HTMLElement>(sel);
			const el = (id: string) => root!.querySelector<HTMLElement>(`[data-layer="${id}"]`)!;

			ctx = gsap.context(() => {
				const circle = el('circle');
				const moons = q('[data-anim="moon"]');
				const linesL = el('lines-l');
				const linesR = el('lines-r');
				const frida = el('frida');
				const eyes = el('face-flowers');
				const blooms = [
					el('side-flower-l'), el('side-flower-r'),
					el('body-flower-l'), el('body-flower-r'),
					el('red-flower-l'), el('red-flower-r')
				];
				const bar = el('down-bar');
				const everything = [circle, ...moons, linesL, linesR, frida, eyes, ...blooms, bar];

				// each layer's resting opacity (moons .91, marigold eyes .92, rest 1)
				const alphaOf = (n: HTMLElement) => Number(n.dataset.alpha ?? 1);

				if (reduced) {
					// No movement — the composition simply fades in, then the
					// rest of the page follows.
					gsap.set(everything, { autoAlpha: 0 });
					unsub = stageOpen.subscribe((v) => {
						if (!v || played) return;
						played = true;
						everything.forEach((n) =>
							gsap.to(n, { autoAlpha: alphaOf(n), duration: 0.7, ease: 'power1.out' })
						);
						gsap.delayedCall(0.75, () => introComplete.set(true));
					});
					return;
				}

				// ── initial states ────────────────────────────────────────────────
				gsap.set(circle, { autoAlpha: 0, scale: 0.4, rotation: -28, transformOrigin: '50% 50%' });
				gsap.set(moons, { autoAlpha: 0, y: 34, scale: 0.86, transformOrigin: '50% 60%' });
				gsap.set(linesL, { autoAlpha: 0, x: -46 });
				gsap.set(linesR, { autoAlpha: 0, x: 46 });
				// face + marigold eyes are one aligned unit — identical motion
				// (same y travel, no scale, so they never drift apart mid-tween)
				gsap.set(frida, { autoAlpha: 0, y: 64 });
				gsap.set(eyes, { autoAlpha: 0, y: 64 });
				blooms.forEach((b) => gsap.set(b, { autoAlpha: 0, scale: 0.55, transformOrigin: '50% 100%' }));
				gsap.set(bar, { autoAlpha: 0, clipPath: 'inset(0% 50% 0% 50%)' });

				// ── ambient loops, once assembled — cheap transforms only ────────
				const ambient = () => {
					gsap.to(circle, { rotation: '+=360', duration: 140, ease: 'none', repeat: -1 });
					moons.forEach((m, i) =>
						gsap.to(m, {
							y: i % 2 ? -7 : -10,
							duration: 5.4 + i * 0.9,
							ease: 'sine.inOut',
							yoyo: true,
							repeat: -1
						})
					);
					// every BODY_FOWER + SIDe_FLOWER gets a small back-and-forth:
					// a sway from the stem plus a light lateral drift, desynced so
					// the garden feels alive rather than metronomic
					blooms.forEach((b, i) =>
						gsap.to(b, {
							rotation: i % 2 ? 2.1 : -2.1,
							x: i % 2 ? 5 : -5,
							duration: 3.2 + (i % 3) * 0.7,
							ease: 'sine.inOut',
							yoyo: true,
							repeat: -1,
							delay: i * 0.35,
							transformOrigin: '50% 100%'
						})
					);
				};

				// ── entrance — fires when the veil lifts ──────────────────────────
				unsub = stageOpen.subscribe((v) => {
					if (!v || played) return;
					played = true;

					const tl = gsap.timeline({ delay: 0.1, onComplete: ambient });

					tl
						// halo spins open on the dark stage
						.to(circle, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.25, ease: 'power3.out' }, 0)
						// side dashes slide in
						.to(linesL, { autoAlpha: 1, x: 0, duration: 0.9, ease: 'power3.out' }, 0.35)
						.to(linesR, { autoAlpha: 1, x: 0, duration: 0.9, ease: 'power3.out' }, 0.35)
						// moons drift up behind the shoulders
						.to(moons, { autoAlpha: 0.91, y: 0, scale: 1, duration: 1.1, ease: 'power2.out', stagger: 0.12 }, 0.45)
						// she rises — marigold eyes rise WITH her (layered together)
						.to(frida, { autoAlpha: 1, y: 0, duration: 1.15, ease: 'power3.out' }, 0.55)
						.to(eyes, { autoAlpha: 0.92, y: 0, duration: 1.15, ease: 'power3.out' }, 0.55)
						// flowers bloom from their stems
						.to(blooms, { autoAlpha: 1, scale: 1, duration: 0.85, ease: 'back.out(1.7)', stagger: 0.09 }, 1.15)
						// papel picado unrolls from the centre
						.to(bar, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.95, ease: 'power2.inOut' }, 1.45)
						// hand off to the page slightly before the last frame so the
						// wordmark + background + copy blend in instead of queueing up
						.call(() => introComplete.set(true), [], 1.9);
				});
			}, root);
		})();

		return () => {
			unsub();
			ctx?.revert();
		};
	});
</script>

<div bind:this={root} class="visual" aria-hidden="true">
	{#each LAYERS as l (l.id)}
		<div
			data-layer={l.id}
			data-anim={l.anim}
			data-alpha={l.o ?? 1}
			class="layer"
			style={`left:${l.x}%; top:${l.y}%; width:${l.w}%; z-index:${l.z};`}
		>
			<img src={l.src} alt="" draggable="false" class="layer-img" class:flip={l.flip} />
		</div>
	{/each}
</div>

<style>
	/*
	  Container aspect ratio matches the Figma frame (4571.11 × 5585.90).
	  Every layer is % positioned/sized, so the whole composition scales as one.
	*/
	.visual {
		position: relative;
		aspect-ratio: 4571.11 / 5585.9;
		pointer-events: none;
		user-select: none;
	}
	.layer {
		position: absolute;
		will-change: transform, opacity;

		/* ⚠ Hidden on first paint — gsap re-asserts + animates once loaded.
		   CSS owns frame zero (same pattern as the old preloader). */
		opacity: 0;
		visibility: hidden;
	}
	.layer-img {
		display: block;
		width: 100%;
		height: auto;
	}
	.layer-img.flip {
		/* Mirror lives on the inner img only — GSAP never touches this node,
		   so the flip can't be read into (or clobbered by) its tweens. */
		transform: scaleX(-1);
	}
</style>
