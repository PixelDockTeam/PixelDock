<script lang="ts">
	import type { Game, InfoReturn, ReleaseDate } from '$lib';
	import IgdbImage from '$lib/components/CustomComponents/IGDBImage.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { invoke } from '@tauri-apps/api';
	import { Play } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import DownloadDialog from '../components/DownloadDialog.svelte';
	import QuickInfo from '../components/QuickInfo/QuickInfo.svelte';

	export let gameInfo: InfoReturn;

	let releaseDates: ReleaseDate[];
	let releaseDate: ReleaseDate;
	let isReleased: boolean;
	let inLibrary = false;
	let gameData: Game;
	$: releaseDates = gameInfo.release_dates ?? [];
	$: releaseDate = releaseDates?.find((item) => item.platform === 6) ?? releaseDates[0];
	$: isReleased = isReleased = (releaseDate?.date ?? 0) < Date.now() / 1000;

	async function getGame(game_id: string): Promise<Game[]> {
		const resp = (await invoke('get_game', { game_id: game_id })) as any;
		let objs = Object.values(resp); // returns [ Object, Object, ... ]
		return Object.values(objs) as Game[];
	}
	onMount(async () => {
		const gamesLib = await getGame(gameInfo.id.toString());
		inLibrary = gamesLib.length > 0;
		gameData = gamesLib[0];
	});
</script>

<div class="sm:-mt-24 sm:flex sm:items-start sm:space-x-5">
	<div class="relative flex">
		<IgdbImage
			imageId={gameInfo.cover?.image_id ?? ''}
			alt={gameInfo.name}
			class="h-72 rounded-lg object-cover ring-4 ring-primary"
			imageSize={'cover_big'}
		/>
		<div
			class="absolute bottom-1 right-0 z-50 flex w-full items-center justify-center gap-1 overflow-visible text-center"
		></div>
	</div>

	<div class="mt-12 sm:min-w-0 sm:flex-1 sm:items-center sm:justify-start sm:pb-1">
		<section class="flex">
			<div class="mt-16 min-w-0 flex-1 sm:hidden md:block">
				<h1 class="truncate text-2xl font-bold">{gameInfo.name}</h1>
			</div>
			<div
				class="mt-14 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0"
			>
				{#if !inLibrary}
					<DownloadDialog data={gameInfo} />
				{:else}
					<Button on:click={async() => invoke('launch_exe', { exePath: gameData.path })}>
						<Play class=" mr-5 h-4 w-4" />
						Play
					</Button>
				{/if}
			</div>
		</section>

		<QuickInfo {gameInfo} {isReleased} {releaseDate} />
	</div>
</div>
