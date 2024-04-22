<script lang="ts">
	import GameVisuals from './GameVisuals.svelte';

	export let gameInfo: InfoReturn;
</script>

<div class="flex flex-col gap-6">
	<section>
		<h1 class="text-xl font-medium">About The Game</h1>
		<p class="pt-2 text-sm text-slate-400">
			{gameInfo.storyline ?? gameInfo.summary ?? '??'}
		</p>
	</section>

	<GameVisuals {gameInfo} />
</div>
