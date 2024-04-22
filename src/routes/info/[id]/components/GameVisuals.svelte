<script lang="ts">
	import type { IGDBData } from '$lib';
	import IgdbImage from '$lib/components/CustomComponents/IGDBImage.svelte';

	export let gameInfo: IGDBData;
</script>

<div>
	<h1 class="pb-4 text-xl font-medium">Visuals</h1>
	<div class="flex w-full flex-col gap-4">
		<iframe
			class="aspect-video h-[500px] w-full rounded-lg"
			src="https://www.youtube.com/embed/{gameInfo.videos?.[0].video_id}"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
		<div class="flex gap-2">
			<div class="w-1/2">
				<IgdbImage
					imageId={gameInfo.artworks && gameInfo.artworks[0] ? gameInfo.artworks[0].image_id : null}
					alt={gameInfo.name}
					class="h-full max-h-[310px] w-full rounded-lg object-cover"
				/>
			</div>
			<div class="w-1/2">
				<ul class="grid grid-cols-2 gap-2">
					{#if gameInfo.screenshots && gameInfo.screenshots.length > 0}
						{#each gameInfo.screenshots.splice(0, 4) as screenshot (screenshot.image_id)}
							<li>
								<IgdbImage
									imageId={screenshot.image_id}
									alt={gameInfo.name}
									class="h-full w-full rounded-lg object-cover"
								/>
							</li>
						{/each}
					{/if}
				</ul>
			</div>
		</div>
	</div>
</div>
