<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import { Progress } from '$lib/components/ui/progress';
	import { ArrowDownUp, Clock, File, Pause, PlayIcon, Trash } from 'lucide-svelte';
	import X from 'lucide-svelte/icons/x';
	import { rqbitStore } from '../utils/rqbitController';
	import type { TorrentData } from '../utils/torrentDataProvider';


	export let torrent: TorrentData; // define torrent as TorrentStoreData type

</script>

<!--torrent component-->
{#if torrent.stats }
<div class="mt-4 rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
	<div class="flex w-full items-center space-x-4 p-6">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="h-6 w-6"
		>
			<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
			<path d="M12 12v9"></path>
			<path d="m8 17 4 4 4-4"></path>
		</svg>
		<div class="grid flex-1 gap-2">
			<h2 class="text-sm font-bold tracking-wider">
				{torrent.name}
			</h2>
			<section class="flex gap-2 text-slate-300">
				<p class="flex items-center gap-2 text-sm font-medium tracking-wider">
					<Clock class="h-4 w-4" />
					{#if torrent.stats.live && torrent.stats.live.time_remaining}
						{torrent.stats.live.time_remaining.human_readable}
					{:else if torrent.stats.state === 'paused'}
						<!-- Display information for paused state here -->
						<span class="text-xs">Paused</span>
					{:else}
						<span class="text-xs">Finished</span>
					{/if}
				</p>
				<p class="flex items-center gap-2 text-xs font-medium tracking-wider">
					<File class="h-4 w-4" />
					{#if torrent.stats && torrent.stats.total_bytes < 1024 * 1024 * 1024}
						{(torrent.stats.progress_bytes / 1024 / 1024).toFixed(2)}
						of {(torrent.stats.total_bytes / 1024 / 1024).toFixed(2)}MB
					{:else}
						{(torrent.stats.progress_bytes / 1024 / 1024 / 1024).toFixed(2)}
						of {(torrent.stats.total_bytes / 1024 / 1024 / 1024).toFixed(2)}GB
					{/if}
				</p>
				<p class="flex items-center gap-2 text-xs font-medium tracking-wider">
					<ArrowDownUp class="h-4 w-4" />
					{#if torrent.stats.live}
						Internet Speed: {torrent.stats.live.download_speed.human_readable}
					{/if}
				</p>
			</section>
		</div>

		<div class="ml-auto flex items-center space-x-2">
			<Button
				on:click={() => {
					$rqbitStore?.delete(torrent.id);
				}}
				variant="outline"
				class="border-none"
				size="icon"
			>
				<Trash class="h-4 w-4 opacity-50 hover:opacity-100 " />
			</Button>
			{#if torrent.stats.state === 'live'}
				<Button
					on:click={() => {
						$rqbitStore?.pause(torrent.id);
					}}
					variant="outline"
					class="border-none"
					size="icon"
				>
					<Pause class="h-4 w-4 opacity-50 hover:opacity-100" />
				</Button>
			{:else if torrent.stats.state === 'paused'}
				<Button
					on:click={() => {
						$rqbitStore?.start(torrent.id);
					}}
					variant="outline"
					class="border-none"
					size="icon"
				>
					<PlayIcon class="h-4 w-4 opacity-50 hover:opacity-100" />
				</Button>
			{/if}
			<Button
				on:click={() => {
					$rqbitStore?.forget(torrent.id);
				}}
				variant="outline"
				class="border-none"
				size="icon"
			>
				<X class="h-4 w-4 opacity-50 hover:opacity-100" />
			</Button>
		</div>
	</div>
	<div class="flex items-center p-6 py-3">
		<Progress
			value={torrent.stats ? (torrent.stats.progress_bytes * 100) / torrent.stats.total_bytes : 0}
			max={100}
			class="relative h-2 w-full overflow-hidden rounded-full bg-primary/20"
		/>
	</div>
</div>
<!--torrent component-->
{/if}