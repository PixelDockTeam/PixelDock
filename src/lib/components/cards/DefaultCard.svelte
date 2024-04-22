<script lang="ts">
	import IgdbImage from '$lib/components/CustomComponents/IGDBImage.svelte';
	import * as Card from '$lib/components/ui/card';
	import type { IGDBReturnDataType } from '$lib/utils/igdb/types';

	export let data: IGDBReturnDataType;

	$: item = data;
</script>

<Card.Root class="group relative  m-0 mt-3 w-[200px] rounded-t-lg p-0 ">
	<Card.Content class="m-0 p-0">
		<div
			class="2 group relative overflow-hidden rounded-t-lg focus:outline-none dark:ring-offset-gray-900"
		>
			<IgdbImage
				imageId={item.cover?.image_id}
				alt={item.name}
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
							{item.name}
						</h4>
						<ul class="flex w-full items-center justify-center gap-1 text-xs text-slate-400">
							{#each item.genres.slice(0, 2) as genre, i (genre.id)}
								<li>{genre.name}{i !== item.genres.slice(0, 2).length - 1 ? ',' : ''}</li>
							{/each}
						</ul>
					</div>
					<a
						href="/info/{item.id}"
						class="mt-1 inline-flex items-center justify-center space-x-2 rounded-lg border border-primary bg-primary px-3 py-2 text-sm font-semibold leading-5 text-white hover:border-primary/60 hover:bg-primary/60 hover:text-white focus:ring-opacity-50 active:border-primary active:bg-primary"
					>
						<svg
							opacity={0.7}
							xmlns="http://www.w3.org/2000/svg"
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
						<span class="-mt-[1px] text-sm">More Info</span>
					</a>
				</div>
			</div>
			<!-- END Item Overlay -->
		</div>
	</Card.Content>
</Card.Root>
