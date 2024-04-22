<script lang="ts" generics="T extends any[] | string">
	import { onMount } from 'svelte';
	import { pluginStore } from '../../../../plugins/PluginsStore';
	import { browser } from '$app/environment';

	export let title: string;
	export let data: T;
	export let id: string;

</script>

<li class="flex items-center justify-between p-1">
	<span id="{id}" class="mr-1 text-sm font-semibold">{title}</span>
	{#if typeof data === 'string'}
		<span id="value" class="text-sm font-medium text-primary">{data}</span>
	{:else if Array.isArray(data)}
		<div class="flex space-x-2">
			{#each data?.slice(0, 2) as item, i (i)}
				<span class="text-sm font-medium text-primary">
					{item.name}
				</span>
			{/each}
		</div>
	{/if}
</li>
