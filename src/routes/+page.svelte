<script lang="ts">
	import Swipe from '$lib/components/CustomComponents/Swipe/index.svelte';
	import { Button } from '$lib/components/ui/button';
	import fetcher from '$lib/utils/fetcher';

	import DefaultCard from '$lib/components/cards/DefaultCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import MainContainer from '$lib/containers/MainContainer.svelte';
	import { createQuery } from '@tanstack/svelte-query';

	const query = createQuery({
		queryKey: ['igdb', 'most-anticipated'],
		queryFn: () => fetcher.igdbMostAnticipated()
	});
</script>

<MainContainer>
	<div>
		<h3 class="pb-2 pl-2 font-mono text-lg font-medium leading-6">Top Rated</h3>
		<Swipe />
	</div>

	<div class="mx-auto">
		<div class="flex items-center justify-between border-b border-primary/80 pb-2 pt-20">
			<p class="m-0 p-0 text-foreground">Most Anticipated</p>
			<Button variant="link" class="m-0 p-0 text-sm text-slate-400">View More</Button>
		</div>
		<!-- TODO: Fix card list not going offscreen and scrollable// scrollable is easy -- shadcdn carousel -->
		<section class="flex gap-2">
			{#if $query.isLoading}
				{#each Array(6) as _, i (i)}
					<Skeleton
						class="group relative m-0 mt-3 max-h-[325px] min-h-[325px] w-[200px] overflow-hidden rounded-t-lg p-0"
					/>
				{/each}
			{:else if $query.isError}
				<p>Error: {$query.error.message}</p>
			{:else if $query.isSuccess}
				<!-- Splice the results for now -->
				{#each $query.data.splice(0, 6) as item}
					<DefaultCard data={item} />
				{/each}
			{/if}
		</section>
	</div>
</MainContainer>
