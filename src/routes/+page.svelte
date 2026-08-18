<script lang="ts">
	import { page } from '$app/stores';
	import HomeContent from '$lib/components/HomeContent.svelte';

	// Absolute URL — social scrapers (iMessage, Instagram, X, Slack…) ignore
	// relative og:image paths. Resolves correctly on localhost, network IP,
	// and the production domain alike.
	const previewUrl = $derived(new URL('/PREVIEW.jpg', $page.url.origin).href);
</script>

<svelte:head>
	<title>Karnavale</title>
	<meta
		name="description"
		content="Karnavale · Festival de l'Halloween · 30 et 31 octobre 2026 · New City Gas, Montréal. Inscrivez-vous à la prévente."
	/>

	<!-- ── social link preview (Open Graph + Twitter) ──
	     Image served from /static/PREVIEW.jpg (2560×1440). -->
	<meta property="og:title" content="Karnavale — Festival de l'Halloween" />
	<meta
		property="og:description"
		content="30 et 31 octobre 2026 · New City Gas, Montréal. Inscrivez-vous à la prévente."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:image" content={previewUrl} />
	<meta property="og:image:width" content="2560" />
	<meta property="og:image:height" content="1440" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Karnavale — Festival de l'Halloween" />
	<meta
		name="twitter:description"
		content="30 et 31 octobre 2026 · New City Gas, Montréal."
	/>
	<meta name="twitter:image" content={previewUrl} />
</svelte:head>

<!--
	Same page, same content (HomeContent) — visiting /information just makes
	+layout.svelte auto-scroll down to the #information section once the
	preloader finishes (only when the section is enabled in config.ts).
-->
<HomeContent />
