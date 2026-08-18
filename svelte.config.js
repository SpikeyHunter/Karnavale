import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// Explicit Vercel adapter + pinned runtime — adapter-auto resolves the
		// adapter at build time and picked one incompatible with Vercel's
		// Node 24 build image ("Unsupported Node.js version" error).
		adapter: adapter({ runtime: 'nodejs22.x' })
	}
};

export default config;
