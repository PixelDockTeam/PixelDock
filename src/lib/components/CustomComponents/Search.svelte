<script lang="ts">
	import * as HoverCard from '$lib/components/ui/hover-card/index';
	import fetcher from '$lib/utils/fetcher';
	import type { IGDBReturnDataType } from '$lib/utils/igdb/types';
	import { debounce } from '$lib/utils/utils';
	import { Joystick, ShipWheel } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { get, writable } from 'svelte/store';

	// Store declarations
	let searchTerm = writable<string>('');
	export let isVisible = writable<boolean>(false);
	let searchPerformed = writable<boolean>(false);
	let isLoading = writable<boolean>(false);
	let searchResults = writable<IGDBReturnDataType[]>([]);

	let searchInput: HTMLInputElement;

	// Function declarations
	function handleKeydown(event: KeyboardEvent) {
		if (event.altKey && event.key === 'k') {
			isVisible.set(!get(isVisible));
		}

		if (event.key === 'Escape') isVisible.set(false);
	}

	// Function to handle clicks outside the modal
	function handleClickOutside(event: MouseEvent) {
		if (searchInput && !searchInput.contains(event.target as Node)) {
			isVisible.set(false);
		}
	}

	const handleInput = debounce((event: Event) => {
		searchTerm.set((event.target as HTMLInputElement).value);
	}, 500);

	// Reactive statements
	$: if ($searchTerm.length > 3) {
		isLoading.set(true);
		searchPerformed.set(true);

		fetcher
			.igdbSearch($searchTerm)
			.then((data) => {
				searchResults.set(data);
				isLoading.set(false);
			})
			.catch((error) => {
				console.error(error);
				isLoading.set(false);
			});
	} else {
		searchResults.set([]);
		searchPerformed.set(false);
	}

	$: if ($isVisible) {
		setTimeout(() => {
			searchInput.focus();
			document.addEventListener('click', handleClickOutside);
		}, 300);
	}
	$: if (!$isVisible) {
		document.removeEventListener('click', handleClickOutside);
	}
	// $: if (!$isVisible) {
	// 	document.removeEventListener('click', handleClickOutside);
	// }
	// Event handlers
	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeydown);
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $isVisible}
	<div class="relative z-50" role="dialog" aria-modal="true">
		<div class="backdrop-leave fixed inset-0 bg-background bg-opacity-25 transition-opacity"></div>

		<div
			class="command-palette-leave fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20"
		>
			<div
				class="mx-auto max-w-xl transform rounded-xl bg-secondary p-2 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
			>
				<input
					bind:this={searchInput}
					type="text"
					class="w-full border-x-0 border-b border-t-0 bg-muted px-4 py-2.5 focus:border-primary focus:ring-0 sm:text-sm"
					placeholder="Search..."
					role="combobox"
					aria-expanded="false"
					aria-controls="options"
					on:input={handleInput}
				/>

				<!-- Results, show/hide based on command palette state. -->
				{#if $isLoading}
					<div class="flex items-center justify-center px-4 py-14 text-center sm:px-14">
						<ShipWheel class="mr-2 h-9 w-9 animate-spin stroke-primary text-primary" />
					</div>
				{:else}
					<!-- Results, show/hide based on command palette state. -->
					<ul
						class="-mb-2 max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm"
						id="options"
						role="listbox"
					>
						<!--						TODO: shadcdn link preload on games-->
						{#if $searchPerformed && $searchResults.length === 0}
							<div class="px-4 py-14 text-center sm:px-14">
								<Joystick class="mx-auto h-6 w-6 text-gray-400" />
								<p class="mt-4 text-sm">No Games found using that search term.</p>
							</div>
						{:else}
							{#each $searchResults as item, id}
								<div class="flex w-full">
									<HoverCard.Root>
										<HoverCard.Trigger
											href="/info/{item.id}"
											class="w-full cursor-default select-none rounded-md px-4 py-2 hover:cursor-pointer hover:bg-primary hover:text-white"
											id="option-{id}"
											role={'option'}
										>
											{item.name}
										</HoverCard.Trigger>
										<!--										TODO: hover card for games -->
										<!--										<HoverCard.Content class="w-80">-->
										<!--											<div class="flex justify-between space-x-4">-->

										<!--												<div class="space-y-1">-->
										<!--													<h4 class="text-sm font-semibold">@sveltejs</h4>-->
										<!--													<p class="text-sm">Cybernetically enhanced web apps.</p>-->
										<!--													<div class="flex items-center pt-2">-->
										<!--														<CalendarDays class="w-4 h-4 mr-2 opacity-70" />{" "}-->
										<!--														<span class="text-xs text-muted-foreground">-->
										<!--            Joined September 2022-->
										<!--          </span>-->
										<!--													</div>-->
										<!--												</div>-->
										<!--											</div>-->
										<!--										</HoverCard.Content>-->
									</HoverCard.Root>
								</div>
							{/each}
						{/if}
					</ul>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	/* .backdrop-enter {
		@apply opacity-0 duration-300 ease-out;
	} */
	.backdrop-leave {
		@apply opacity-100 duration-200 ease-in;
	}

	/* .command-palette-enter {
		@apply scale-95 opacity-0 duration-300 ease-out;
	} */
	.command-palette-leave {
		@apply scale-100 opacity-100 duration-200 ease-in;
	}
</style>
