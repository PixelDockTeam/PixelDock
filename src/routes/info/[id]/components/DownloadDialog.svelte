<script lang="ts">
	import { goto } from '$app/navigation';
	import type { AddTorrentResponse, IGDBData, ProviderInfoResponse, TorrentFile } from '$lib';
	import IgdbImage from '$lib/components/CustomComponents/IGDBImage.svelte';
	import { Button } from '$lib/components/ui/button/index';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import { cn } from '$lib/utils.js';
	import { open as openShell } from '@tauri-apps/api/shell';
	import {
		Bean,
		ChevronsRight,
		CircleCheck,
		CircleX,
		Download,
		DownloadIcon,
		RotateCw,
		Save,
		ShipWheel,
		UserCheck,
		UserX,
		VenetianMask
	} from 'lucide-svelte';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import { rqbitStore } from '../../../downloads/utils/rqbitController';
	// Data Declarations
	import { T1337x } from '$lib/utils/1337x';
	import type { torrentData } from '$lib/utils/1337x/types';
	import { toast } from 'svelte-sonner';
	import {
		listTorrentMagnet,
		startTorrentMagnet
	} from '../../../downloads/utils/torrentDataProvider';

	const providers = [
		{
			value: 'steam',
			label: 'Steam'
		},
		{
			value: 'gog',
			label: 'GoG'
		},
		{
			value: 'epicgames',
			label: 'EpicGames'
		},
		{
			value: '1337x',
			label: '1337x'
		}
	];

	export let data: IGDBData;
	let apiData: ProviderInfoResponse[] = []; // To store API data
	let open = false;
	let value = 'steam';
	let selectedValue: string;

	//Torrent Management
	let torrentListPending = false;
	let isDownloading = false;
	let torrentResponse: AddTorrentResponse;
	let magnetUrl = '';

	// Reactive Statements
	$: selectedValue = providers.find((f) => f.value === value)?.label ?? 'Search providers...';
	$: console.log(selectedValue);
	console.log(data);

	const steamStore =
		data.websites.find((website) => website.url.includes('https://store.steampowered.com'))?.url ||
		'';
	const gogStore =
		data.websites.find((website) => website.url.includes('https://www.gog.com'))?.url || '';
	const epicGamesStore =
		data.websites.find((website) => website.url.includes('https://www.epicgames.com/store'))?.url ||
		'';

	const tSearch = new T1337x();
	let torrents: torrentData[] = [];
	tSearch.search(data.name).then((data) => {
		torrents = data.sort((a, b) => {
			return a.trusted === b.trusted ? 0 : a.trusted ? -1 : 1;
		});
		console.log(data);
	});

	let groupedFiles: GroupedFiles;
	let individualFiles: TorrentFile[];
	let directory: any;

	//! Fetch Torrent Files
	async function instantiateTorrent(magnetUrl: string) {
		toast.message('Fetching Torrent...');
		await listTorrentMagnet(magnetUrl).then((data) => {
			torrentListPending = false;
			torrentResponse = data as AddTorrentResponse;
			[groupedFiles, individualFiles] = groupByParentDirectory(torrentResponse.details.files);
			directory = makeDirectory(torrentResponse.details.files);
			console.log(directory);
		});
	}

	//! Start Torrent Download
	async function proceedDownload(magnetURL: string) {
		isDownloading = false;
		toast.message('Starting Download...');
		await startTorrentMagnet(magnetURL);
	}

	//TODO: Remake this yourself better.
	function makeDirectory(files: any) {
		let directoryList = [];
		for (const file of files) {
			file.name = file.components.pop();
			file.components.push(file);
			directoryList.push(file.components);
		}
		return createMultipleDirectoryStructures(directoryList);
	}

	function createMultipleDirectoryStructures(lists: any) {
		let result = {};

		lists.forEach((list: any) => {
			let current = result;
			let file = list.pop(); // Remove and get the last element (file)

			if (list.length === 0) {
				if (!(current as any).individual) {
					(current as any).individual = [];
				}
				(current as any).individual.push(file);
				return; // Skip the rest of the loop for this list
			}
			list.forEach((directory: any) => {
				if (!(current as any)[directory]) {
					(current as any)[directory] = { individual: [] };
				}
				current = (current as any)[directory];
			});

			// Add the file to the innermost directory's individual array
			(current as any).individual.push(file);
		});

		return result;
	}

	function printDirectoryStructure(directory: any, indent = '') {
		let result = '';

		// Check if the current directory has 'individual' property
		if (directory.individual) {
			directory.individual.forEach((file: any) => {
				result += `<li>${file.name}</li>`;
			});
		}

		// Recursively traverse nested directories
		for (let key in directory) {
			if (key !== 'individual') {
				result += `<li><strong>${key}</strong></li>`;
				result += `<ul class="list-disc ml-5">`;
				result += printDirectoryStructure(directory[key], `${indent}    `);
				result += `</ul>`;
			}
		}

		return result;
	}

	//Directory Management
	interface GroupedFiles {
		[key: string]: TorrentFile[];
	}

	function groupByParentDirectory(files: TorrentFile[]): [GroupedFiles, TorrentFile[]] {
		const groupedFiles: GroupedFiles = {};
		const individualFiles: TorrentFile[] = [];

		files.forEach((file) => {
			if (file.components.length > 1) {
				const [parentDirectory] = file.components;

				if (!groupedFiles[parentDirectory]) {
					groupedFiles[parentDirectory] = [];
				}

				groupedFiles[parentDirectory].push(file);
			} else {
				individualFiles.push(file);
			}
		});

		return [groupedFiles, individualFiles];
	}

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	async function handleButtonClick(url: string) {
		await $rqbitStore?.uploadTorrent(url);
		await goto('/downloads');
	}

	// Event handlers
	let fetchData: Promise<ProviderInfoResponse[]>;
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button>
			<Download class="mr-2 h-4 w-4" />
			Download
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		{#if isDownloading}
			<div
				class="fixed inset-0 z-50 flex items-center justify-center"
				style="background-color: rgba(0, 0, 0, 0.5);
		z-index: 99;"
				id="TorrentDownload"
			>
				<div class="w-[400px] rounded-lg bg-background p-8">
					<h2 class="mb-4 text-xl font-semibold text-white">Add Torrent</h2>
					{#if torrentListPending}
						<div class="flex items-center justify-center">
							<ShipWheel class="z-50 h-14 w-14 animate-spin stroke-primary" />
						</div>
					{:else}
						<div class="p-4">
							<ul class="overflow-auto max-h-[300px] ">
								{@html printDirectoryStructure(directory).replace(/\n/g, '<br>')}

								<!--{#each Object.keys(groupedFiles) as parentDirectory}-->
								<!--	<li class="mb-4">-->
								<!--		<strong class="text-lg font-semibold">{parentDirectory}</strong>-->
								<!--		<ul class="ml-4">-->
								<!--			{#each groupedFiles[parentDirectory] as file}-->
								<!--				<li class="mb-2 flex items-center justify-between">-->
								<!--					<span>{file.name}</span>-->
								<!--					<span>{file.length.toLocaleString()} Bytes</span>-->
								<!--				</li>-->
								<!--			{/each}-->
								<!--			<li class="mt-2 flex items-center justify-between">-->
								<!--				<strong-->
								<!--				>Total: {groupedFiles[parentDirectory]-->
								<!--					.reduce((acc, file) => acc + file.length, 0)-->
								<!--					.toLocaleString()} Bytes</strong-->
								<!--				>-->
								<!--			</li>-->
								<!--		</ul>-->
								<!--	</li>-->
								<!--{/each}-->
							</ul>

							<!--{#if individualFiles.length > 0}-->
							<!--	<div class="mt-4">-->
							<!--		<strong class="text-lg font-semibold">Individual Files</strong>-->
							<!--		<ul class="ml-4">-->
							<!--			{#each individualFiles as file}-->
							<!--				<li class="mb-2 flex items-center justify-between">-->
							<!--					<span>{file.name}</span>-->
							<!--					<span>{file.length.toLocaleString()} Bytes</span>-->
							<!--				</li>-->
							<!--			{/each}-->
							<!--		</ul>-->
							<!--	</div>-->
							<!--{/if}-->

							<button
								type="button"
								on:click={() => {
									proceedDownload(magnetUrl);
								}}
								class="border-primary-dark hover:bg-primary-dark rounded-lg border bg-primary px-4 py-2 font-semibold text-white shadow-md transition duration-200 ease-in-out"
							>
								Proceed
							</button>
							<button
								type="button"
								on:click={() => {
									magnetUrl = '';
									isDownloading = false;
								}}
								class="border-secondary-dark hover:bg-secondary-dark rounded-lg border bg-secondary px-4 py-2 font-semibold text-white shadow-md transition duration-200 ease-in-out"
							>
								Cancel
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
		<!--		header-->
		<Dialog.Header class="flex w-full flex-col gap-4">
			<Dialog.Title class="text-center">Select Your Download</Dialog.Title>
			<Dialog.Description class="mx-auto w-full">
				<Popover.Root bind:open let:ids>
					<Popover.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant="outline"
							role="combobox"
							aria-expanded={open}
							class="w-full justify-between"
						>
							{selectedValue}
							<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</Popover.Trigger>
					<Popover.Content class="w-[465px] p-0">
						<Command.Root>
							<Command.Input placeholder="Search providers..." />
							<Command.Empty>No framework found.</Command.Empty>
							<Command.Group>
								{#each providers as provider}
									<Command.Item
										value={provider.value}
										onSelect={(currentValue) => {
											value = currentValue;
											closeAndFocusTrigger(ids.trigger);
										}}
									>
										<Check
											class={cn('mr-2 h-4 w-4', value !== provider.value && 'text-transparent')}
										/>
										{provider.label}
									</Command.Item>
								{/each}
							</Command.Group>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</Dialog.Description>
		</Dialog.Header>
		<!--		Middle-->
		<ScrollArea class="h-72 w-full rounded-md border">
			<div class="p-4">
				<h4 class="mb-4 text-sm font-medium leading-none">Links</h4>
				<ul>
					{#if selectedValue === 'Steam'}
						<div class="flex w-full items-center space-x-4">
							<div class="flex w-full items-center space-x-2">
								<IgdbImage
									imageId={data.cover?.image_id ?? ''}
									alt={data.name}
									class=" rounded-lg object-cover "
									imageSize={'micro'}
									width="48"
									height="48"
									style="aspect-ratio: 48 / 48; object-fit: cover;"
								/>
								<div class="text-sm font-medium leading-none">{data.name}</div>
							</div>
							<Button
								on:click={async () => {
									await openShell(steamStore);
								}}
							>Buy on Steam
							</Button>
						</div>
					{/if}
					{#if selectedValue === 'GoG'}
						<div class="flex w-full items-center space-x-4">
							<div class="flex w-full items-center space-x-2">
								<IgdbImage
									imageId={data.cover?.image_id ?? ''}
									alt={data.name}
									class=" rounded-lg object-cover "
									imageSize={'micro'}
									width="48"
									height="48"
									style="aspect-ratio: 48 / 48; object-fit: cover;"
								/>
								<div class="text-sm font-medium leading-none">{data.name}</div>
							</div>
							<Button
								on:click={async () => {
									await openShell(gogStore);
								}}
							>Buy on GoG
							</Button>
						</div>
					{/if}
					{#if selectedValue === 'EpicGames'}
						<div class="flex w-full items-center space-x-4">
							<div class="flex w-full items-center space-x-2">
								<IgdbImage
									imageId={data.cover?.image_id ?? ''}
									alt={data.name}
									class=" rounded-lg object-cover "
									imageSize={'micro'}
									width="48"
									height="48"
									style="aspect-ratio: 48 / 48; object-fit: cover;"
								/>
								<div class="text-sm font-medium leading-none">{data.name}</div>
							</div>
							<Button
								on:click={async () => {
									await openShell(epicGamesStore);
								}}
							>Buy on Epic Games
							</Button>
						</div>
					{/if}
					{#if selectedValue === '1337x'}
						{#each torrents as torrent}
							<!-- <div class="flex w-full items-center space-x-4">
								<div class="flex w-full items-center space-x-2">
									<div class="flex items-center text-sm font-medium leading-none">
										{torrent.name}
										{#if torrent.trusted}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="3"
												stroke-linecap="round"
												stroke-linejoin="round"
												class="lucide lucide-circle-check ml-2 text-primary"
											>
												<title>Trusted</title>
												<circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg
											>
										{:else}
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
												class="lucide lucide-circle-check ml-2 text-secondary"
											>
												<title>Not Trusted</title>
												<circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
											</svg>
										{/if}
									</div>
								</div>
								<Button
									on:click={async () => {
										magnetUrl = await tSearch.getMagnetLink(torrent.href);
										await instantiateTorrent(magnetUrl);
									}}>{torrent.size}</Button
								>
							</div> -->
							<button
								on:click={async () => {
									torrentListPending = true;
									isDownloading = true;
									magnetUrl = await tSearch.getMagnetLink(torrent.href);
									await instantiateTorrent(magnetUrl);
								}}
								class="group flex w-full cursor-pointer flex-col items-start justify-center gap-2 p-2 text-start text-sm hover:bg-primary"
							>
								{torrent.name}
								<div class="flex w-full flex-row items-center justify-start gap-3">
									<div class="flex items-center gap-1 text-xs text-slate-300">
										{#if torrent.trusted}
											<UserCheck class="h-4 w-4 stroke-primary group-hover:stroke-foreground" />
										{:else}
											<UserX class="h-4 w-4 stroke-primary group-hover:stroke-foreground" />
										{/if}
										{torrent.uploader}
									</div>
									<div class="flex items-center gap-1 text-xs text-slate-300">
										<Save class="h-4 w-4 stroke-primary group-hover:stroke-foreground" />
										{torrent.size}
									</div>
									<div class="flex items-center gap-1 text-xs text-slate-300">
										{#if torrent.trusted}
											<CircleCheck class="h-4 w-4 stroke-primary group-hover:stroke-foreground" />
											Trusted
										{:else}
											<CircleX class="h-4 w-4 stroke-primary group-hover:stroke-foreground" />
											Not-Trusted
										{/if}
									</div>
									<div class="flex items-center gap-1 text-xs text-slate-300">
										<Bean class="h-4 w-4 stroke-primary group-hover:stroke-foreground" />
										{torrent.seed}
									</div>
								</div>
							</button>
							<Separator class="my-2" />
						{/each}
					{/if}
					{#await fetchData}
						<div class="flex items-center justify-center px-4 py-14 text-center sm:px-14">
							<RotateCw class="mr-2 h-8 w-8 animate-spin stroke-primary text-primary" />
						</div>
					{:then apiData}
						{#if apiData && apiData.length > 0}
							{#each apiData as dataItem, index (index)}
								{#each dataItem?.downloads as data, i (i)}
									{#if data.name === 'magnet'}
										<button
											on:click={() => handleButtonClick(data.url)}
											class="group flex w-full cursor-pointer flex-col items-start justify-center gap-2 p-2 text-start text-sm hover:bg-primary"
										>
											{dataItem.title}
											<div class="flex w-full flex-row items-center justify-start gap-3">
												<div class="flex items-center gap-1 text-xs text-slate-300">
													<DownloadIcon
														class="h-3 w-3 stroke-primary group-hover:stroke-foreground"
													/>
													Magnet
												</div>
												<div class="flex items-center gap-1 text-xs text-slate-300">
													<Save class="h-3 w-3 stroke-primary group-hover:stroke-foreground" />
													{dataItem.fileSize}
												</div>
												<div class="flex items-center gap-1 text-xs text-slate-300">
													<VenetianMask
														class="h-3 w-3 stroke-primary group-hover:stroke-foreground"
													/>
													{dataItem.group}
												</div>
											</div>
										</button>
										<Separator class="my-2" />
									{/if}
								{/each}
							{/each}
						{/if}
					{:catch error}
						<p>Something went wrong: {error.message}</p>
					{/await}
				</ul>
			</div>
		</ScrollArea>
		<!--		footer-->
		<Dialog.Footer class="w-full">
			<Button class="flex w-full items-center gap-2 bg-muted" type="submit">
				Show All Providers
				<ChevronsRight class="h-5 w-5 stroke-slate-300" />
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
