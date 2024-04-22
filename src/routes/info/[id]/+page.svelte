<script lang="ts">
	// import types
	import type { InfoReturn } from '$lib';
	// import components
	import IgdbImage from '$lib/components/CustomComponents/IGDBImage.svelte';
	import Bottom from './components/Bottom.svelte';
	import Middle from './components/Middle.svelte';
	import Top from './components/Top.svelte';

	import { page } from '$app/stores';
	import fetcher from '$lib/utils/fetcher';
	import { writable } from 'svelte/store';
	import { ShipWheel } from 'lucide-svelte';
	// Assuming the URL is something like `/route/123/`
	const id = $page.url.pathname.split('/');
	const realId = id[id.length - 2];

	const data = writable<{ gameInfo: InfoReturn }>();

	const fetch = async () => {
		const gameInfo = await fetcher.igdbInfo(realId);

		if (!gameInfo || !gameInfo) return;

		data.set({ gameInfo });
	};

	fetch();
</script>

<div class=" pb-20">
	{#if $data?.gameInfo}
		{@const data = $data}
		<div>
			<IgdbImage
				imageId={data?.gameInfo?.screenshots?.[0]?.image_id ?? ''}
				alt={data?.gameInfo.name}
				class="h-64 w-full overflow-hidden rounded-b-lg object-cover lg:h-72"
				imageSize={'screenshot_med'}
			/>
		</div>
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<Top gameInfo={data?.gameInfo} />

			<Middle gameInfo={data?.gameInfo} />

			<Bottom gameInfo={data?.gameInfo} />
		</div>
	{:else}
		<ShipWheel class="fixed left-1/2 z-50 h-14 w-14 animate-spin stroke-primary " />
		<!-- <ShipWheel class="fixed bottom-4 right-10 z-50 h-14 w-14 animate-spin stroke-primary" /> -->
	{/if}
</div>

<style>
	* {
		background-color: hsla(222, 83%, 4%, 1);
		background-image: none !important;
	}
</style>
