<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { FileUp, Link } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import TorrentCard from './components/TorrentCard.svelte';
	import { lastUpdated, torrentsStore } from './stores/stores';
	import { isConfigured } from './utils/rqbitController';
	import { startAutoRefresh } from './utils/torrentDataProvider';

	let intervalId: number;

	onMount(async () => {
		// every second as 250 was way too quick
		intervalId = startAutoRefresh(1000);
	});

	lastUpdated.subscribe(() => {
		torrentsStore.refresh();
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>
<style>
    * {
        /*todo fix please*/
        background-color: hsla(222.2, 83%, 4.9%, 1);
        background-image: none !important;
    }
</style>

<main>
	{#if $isConfigured}
		<div>
			<div class="border-b px-4 py-5 sm:px-6">
				<div class="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
					<div class="ml-4 mt-2">
						<h3 class="text-base font-semibold leading-6">Downloads</h3>
					</div>
					<div class="ml-4 mt-2 flex-shrink-0">
						<Button class="relative inline-flex items-center border-none text-sm" variant="outline">
							<Link class="mr-2 h-4 w-4" />
							Add Torrent from Magnet / URL
						</Button>
						<Button class="relative inline-flex items-center border-none text-sm" variant="outline">
							<FileUp class="mr-2 h-4 w-4" />
							Upload .torrent File
						</Button>
					</div>
				</div>
			</div>
			<ul>
				{#each $torrentsStore as torrent (torrent.id)}
					<li>
						<TorrentCard {torrent} />
					</li>
				{/each}
			</ul>
		</div>
	{:else}
		<p>Application is not configured. Please configure the application.</p>
	{/if}
</main>
