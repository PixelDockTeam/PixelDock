<script lang="ts">
	import { debounce, type Game } from '$lib';
	import IgdbImage from '$lib/components/CustomComponents/IGDBImage.svelte';
	import * as Card from '$lib/components/ui/card';
	import fetcher from '$lib/utils/fetcher';
	import type { IGDBReturnDataType } from '$lib/utils/igdb/types';
	import { invoke } from '@tauri-apps/api';
	import { open } from '@tauri-apps/api/dialog';
	import { onMount } from 'svelte';

	let showModal = false;
	let newGameName = '';
	let newGameId = '';
	let newGamePath = '';
	let searchResults: IGDBReturnDataType[] = [];

	async function launchExe(exePath: string) {
		try {
			const response = invoke('launch_exe', { exePath: exePath });
			console.log(response);
		} catch (error) {
			console.error('Error launching exe:', error);
		}
	}
	let games: Game[] = [];
	// =
	// [
	// 	{
	// 		name: 'Terraria',
	// 		path: 'E:\\Launchers\\Terraria\\Terraria.exe',
	// 		coverID: 'co1rbo',
	// 		id: '1879'
	// 	},
	// 	{
	// 		name: 'Oxygen Not Included',
	// 		path: 'E:\\Launchers\\Oxygen Not Included\\OxygenNotIncluded.exe',
	// 		coverID: 'co7ugt',
	// 		id: '19542'
	// 	},
	// 	{
	// 		name: 'TModLoader',
	// 		path: 'E:\\Launchers\\tModLoader\\start-tModLoader.bat',
	// 		coverID: 'co48gu',
	// 		id: '134157'
	// 	}
	// ];
	// Function to handle clicks outside the modal

	let fields: any = [];

	let records: any = [];

	function getFields(response: any) {
		let objs = Object.values(response); // returns [ Object, Object, ... ]
		let firstObj: any = objs[0];
		fields = Object.keys(firstObj);
	}

	function getData(response: any) {
		let objs = Object.values(response); // returns [ Object, Object, ... ]
		records = Object.values(objs);
	}

	function handleClickOutside(event: MouseEvent) {
		if (
			showModal &&
			!(event.target as Element).closest('.modal-content') &&
			!(event.target as Element).closest('.search-drop')
		) {
			closeModal();
		}
	}
	function openModal() {
		showModal = true;
		setTimeout(() => {
			document.addEventListener('click', handleClickOutside);
		}, 300);
	}

	function closeModal() {
		document.removeEventListener('click', handleClickOutside);
		showModal = false;
		newGameName = '';
		newGameId = '';
		newGamePath = '';
	}

	async function addGame() {
		// TODO: Add new game to the games array
		// console.log(newGameName);
		// console.log(newGamePath);
		fetcher.igdbInfo(newGameId).then(async (data) => {
			console.log(data.cover.image_id);
			const newGame: Game = {
				id: 1,
				name: newGameName,
				path: newGamePath,
				coverID: data.cover.image_id,
				gameID: newGameId
			};
			// games = [...games, newGame];
			await insertGame(newGame);
			await fetchGames();
			closeModal();
			// console.log(await database.select('SELECT * FROM games', new Map()));
			// setTimeout(async () => {

			// }, 1000);
		});
	}
	async function selectExecutable() {
		const selected = await open({
			multiple: false,
			filters: [
				{
					name: 'Executables',
					extensions: ['exe', 'bat']
				}
			]
		});
		if (!Array.isArray(selected)) {
			newGamePath = selected ? selected : '';
		}
	}

	// Function to handle search input changes
	async function handleSearchInput(event: any) {
		const searchTerm = event.target.value;
		if (searchTerm.length >= 3) {
			// Minimum characters to start search
			const results = await fetcher.igdbSearch(searchTerm);
			searchResults = results; // Update search results
		} else {
			searchResults = []; // Clear results if input is too short
		}
	}

	//DB Management
	async function initDB() {
		// let scripts = [
		// 	{
		// 		name: 'create_table',
		// 		sql: 'CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY,name TEXT NOT NULL,path TEXT NOT NULL,coverID TEXT NOT NULL,gameID TEXT NOT NULL)'
		// 	}
		// ];
	}
	async function closeDB() {}
	async function insertGame(game: Game) {
		await invoke('insert_game', { game: game });
		// await db.update(
		// 	'INSERT INTO games (name, path, coverID, gameID) VALUES (:name, :path, :coverID, :gameID)',
		// 	new Map<string, number | string>([
		// 		[':name', game.name],
		// 		[':path', game.path],
		// 		[':coverID', game.coverID],
		// 		[':gameID', game.gameID]
		// 	])
		// );
	}
	async function fetchGames() {
		const resp = (await invoke('get_games')) as any;
		let objs = Object.values(resp); // returns [ Object, Object, ... ]
		games = Object.values(objs) as Game[];
	}
	onMount(async () => {
		const resp = await invoke('get_tasks');
		await fetchGames();
		console.log(games);
		console.log(resp);
		getFields(resp);
		getData(resp);
		console.log(fields);
		console.log(records);
	});
	// Debounced search function
	const debouncedSearch = debounce(handleSearchInput, 250);
</script>

<!-- TODO: -->
<div class="mx-auto">
	{#if showModal}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center"
			style="background-color: rgba(0, 0, 0, 0.5);"
		>
			<div class="modal-content w-[400px] rounded-lg bg-background p-8">
				<h2 class="mb-4 text-xl font-semibold text-white">Add New Game</h2>
				<form>
					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-600"
							>Game Name:
							<input
								type="text"
								class="mt-1 w-full rounded-md border bg-secondary p-2 text-white"
								bind:value={newGameName}
								placeholder="Enter game name"
								required
							/>
						</label>
					</div>
					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-600"
							>Executable Path:
							<button
								type="button"
								class="mt-1 w-full rounded-md border bg-secondary p-2 text-white {newGamePath != ''
									? 'border-primary'
									: ''}"
								on:click={selectExecutable}
							>
								Select Executable
							</button>
						</label>
					</div>
					<div class="mb-4">
						<label class="block text-sm font-medium text-gray-600"
							>Link Game:
							<input
								type="text"
								class="mt-1 w-full rounded-md border bg-secondary p-2 text-white"
								bind:value={newGameId}
								placeholder="Enter game name"
								required
								on:input={debouncedSearch}
							/>
						</label>
						<!-- Dropdown for search results -->
						{#if searchResults.length != 0}
							<div
								class="search-drop absolute z-10 mt-1 w-full rounded-md border bg-secondary text-primary shadow-lg"
								style="max-height: 200px; overflow-y: auto; width: 100%; max-width: 300px;"
							>
								{#each searchResults as result (result.id)}
									<button
										class="w-full p-2 hover:bg-gray-200"
										on:click={() => {
											newGameId = result.id.toString();
											searchResults = [];
										}}
									>
										{result.name}
									</button>

									<br />
								{/each}
							</div>
						{/if}
					</div>
					<div class="flex justify-end">
						<button
							type="submit"
							class="mr-2 rounded-md border border-primary bg-primary px-4 py-2"
							on:click={addGame}>Add</button
						>
						<button class="rounded-md border-secondary bg-secondary px-4 py-2" on:click={closeModal}
							>Cancel</button
						>
					</div>
				</form>
			</div>
		</div>
	{/if}
	<div class="flex items-center justify-between border-b border-primary/80 pb-2 pt-2">
		<p class="m-0 p-0 text-foreground">Your Games</p>
	</div>
	<!-- TODO: Fix card list not going offscreen and scrollable// scrollable is easy -- shadcdn carousel -->
	<section class="flex flex-wrap gap-2 overflow-auto">
		{#each games as game (game.coverID)}
			<Card.Root class="group relative  m-0 mt-3 w-[193px] rounded-t-lg p-0">
				<Card.Content class="m-0 p-0">
					<div
						class="2 group relative overflow-hidden rounded-t-lg focus:outline-none dark:ring-offset-gray-900"
					>
						<IgdbImage
							imageId={game.coverID}
							imageSize="cover_big"
							alt={game.name}
							class="h-72 w-full object-cover transition duration-300 ease-out group-focus-within:scale-105 group-hover:scale-105 group-focus:scale-105"
						/>

						<!-- Item Overlay -->
						<div
							class="absolute inset-0 flex translate-y-full cursor-pointer flex-col items-center justify-center rounded bg-slate-700 bg-opacity-80 opacity-0 transition duration-300 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100"
						>
							<div class="flex w-full flex-col items-center justify-center gap-4 p-2">
								<div class="flex flex-col gap-1">
									<h4
										class="hyphens-auto whitespace-pre-line break-all text-center font-medium text-white"
									>
										<a href="/info/{game.gameID}">
											{game.name}
										</a>
									</h4>
									<!-- TODO: Can add genre -->
									<!-- <ul class="flex w-full items-center justify-center gap-1 text-xs text-slate-400">
										<li>Sandbox</li>
									</ul> -->
								</div>
								<button
									on:click={() => launchExe(game.path)}
									class="mt-1 inline-flex items-center justify-center space-x-2 rounded-lg border border-primary bg-primary px-3 py-2 text-sm font-semibold leading-5 text-white hover:border-primary/60 hover:bg-primary/60 hover:text-white focus:ring-opacity-50 active:border-primary active:bg-primary"
								>
									<svg
										opacity={0.7}
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-square-arrow-out-up-right"
										><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path
											d="m21 3-9 9"
										/><path d="M15 3h6v6" /></svg
									>
									<span class="-mt-[1px] text-sm">Launch</span>
								</button>
							</div>
						</div>
						<!-- END Item Overlay -->
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
		<Card.Root class="group relative  m-0 mt-3 w-[193px] rounded-t-lg p-0 ">
			<Card.Content class="m-0 p-0">
				<div
					class="2 group relative overflow-hidden rounded-t-lg focus:outline-none dark:ring-offset-gray-900"
				>
					<div class="relative h-72 w-full">
						<svg
							class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform stroke-current text-slate-400"
							width="60"
							height="60"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="10" class="fill-none stroke-2" />
							<path d="M12 8v8M8 12h8" class="stroke-current" />
						</svg>
					</div>
					<!-- Item Overlay -->
					<div
						class="absolute inset-0 flex translate-y-full cursor-pointer flex-col items-center justify-center rounded bg-slate-700 bg-opacity-80 opacity-0 transition duration-300 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100"
					>
						<div class="flex w-full flex-col items-center justify-center gap-4 p-2">
							<div class="flex flex-col gap-1">
								<h4
									class="hyphens-auto whitespace-pre-line break-all text-center font-medium text-white"
								>
									Add another game
								</h4>
								<!-- <ul class="flex w-full items-center justify-center gap-1 text-xs text-slate-400">
									<li>Sandbox</li>
								</ul> -->
							</div>
							<button
								on:click={() => openModal()}
								class="mt-1 inline-flex items-center justify-center space-x-2 rounded-lg border border-primary bg-primary px-3 py-2 text-sm font-semibold leading-5 text-white hover:border-primary/60 hover:bg-primary/60 hover:text-white focus:ring-opacity-50 active:border-primary active:bg-primary"
							>
								<svg
									opacity={0.7}
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-square-arrow-out-up-right"
									><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /><path
										d="m21 3-9 9"
									/><path d="M15 3h6v6" /></svg
								>
								<span class="-mt-[1px] text-sm">Add Game</span>
							</button>
						</div>
					</div>
					<!-- END Item Overlay -->
				</div>
			</Card.Content>
		</Card.Root>
	</section>
</div>
