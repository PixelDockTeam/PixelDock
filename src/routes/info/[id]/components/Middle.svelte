<script lang="ts">
	import Hltb from '$lib/components/CustomComponents/HLTB.svelte';

	export let gameInfo: InfoReturn;
</script>

{#if gameInfo.hltb?.gameplayMain}
	<div class="py-5">
		<Hltb
			times={[
				gameInfo.hltb.gameplayMain,
				gameInfo.hltb.gameplayMainExtra,
				gameInfo.hltb.gameplayCompletionist
			]}
		/>
	</div>
{/if}
