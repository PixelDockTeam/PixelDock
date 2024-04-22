import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({})],
	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		prerender: {
			concurrency: 1,
			crawl: true,
			entries: ['*', '/', '/info/0']  // add specific IDs here
		},
    alias: {
      "@/*": "./path/to/lib/*",
    },
	}
};

export default config;
