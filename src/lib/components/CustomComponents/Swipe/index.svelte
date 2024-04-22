<script lang="ts">
	import IgdbImage from '$lib/components/CustomComponents/IGDBImage.svelte';
	import ScreenShotImage from '$lib/components/CustomComponents/Swipe/ScreenShotImage.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Carousel from '$lib/components/ui/carousel';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import fetcher from '$lib/utils/fetcher';
	import { createQuery } from '@tanstack/svelte-query';
	import Autoplay from 'embla-carousel-autoplay';

	const plugin = Autoplay({ delay: 5000, stopOnInteraction: true });

	const query = createQuery({
		queryKey: ['igdb', 'top-rated'],
		queryFn: () => fetcher.igdbTopRated()
	});
</script>

<Carousel.Root
	plugins={[plugin]}
	class="mx-auto w-full rounded-lg"
	on:mousenter={plugin.stop}
	on:mouseleave={plugin.reset}
>
	<Carousel.Content>
		{#if $query.isLoading}
			<Skeleton class="aspect-auto h-[400px] w-full max-w-[80rem] overflow-hidden rounded-lg" />
		{:else if $query.isError}
			<p>Error: {$query.error.message}</p>
		{:else if $query.isSuccess}
			{#each $query.data as item}
				<Carousel.Item class="">
					<Card.Root>
						<Card.Content class="flex h-[400px] flex-row items-center gap-1 p-4">
							<div class="flex aspect-video h-[350px] items-center justify-center">
								<IgdbImage
									imageId={item.cover?.image_id}
									alt={item.name}
									class="h-full w-full overflow-hidden rounded-xl object-cover"
									imageSize={'screenshot_big'}
								/>
							</div>
							<div class="">
								<Card.Root class="flex flex-col justify-between border-none">
									<Card.Header class="w-full">
										<Card.Title class="w-full">{item.name}</Card.Title>
										<Card.Description>
											<ul class="flex flex-row gap-1">
												{#each item.genres.slice(0, 4) as genre, i (genre.id)}
													<li>{genre.name}{i !== item.genres.slice(0, 4).length - 1 ? ',' : ''}</li>
												{/each}
											</ul>
										</Card.Description>
									</Card.Header>
									<Card.Content class="flex flex-col gap-4 pb-4">
										<p class="line-clamp-6 h-[120px] text-ellipsis text-sm dark:text-gray-300">
											{item?.storyline ?? item?.summary ?? '??'}
										</p>
										<div class="flex justify-between pt-1">
											{#each item?.screenshots?.splice(0, 3) ?? [] as screenshot}
												<ScreenShotImage
													src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${screenshot.image_id}.png`}
													alt={item.name}
												/>
											{/each}
										</div>
									</Card.Content>
									<Card.Footer class="flex w-full flex-row justify-end">
										<Button href="/info/{item.id}" class="flex items-center justify-center gap-2">
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
											<span class="-mt-[1px]"> More Info </span>
										</Button>
									</Card.Footer>
								</Card.Root>
							</div>
						</Card.Content>
					</Card.Root>
				</Carousel.Item>
			{/each}
		{/if}
	</Carousel.Content>
	<!--	<Carousel.Previous />-->
	<!--	<Carousel.Next />-->
</Carousel.Root>
