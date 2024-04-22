<script lang="ts">

	import { pluginStore } from '../../../../plugins/PluginsStore';
	import type { PackageInfo } from '../../../../plugins/utils/pluginUtils';
	import { onMount } from 'svelte';
	// todo use sdk types


	export let plugin: PackageInfo;
	let localPlugin = plugin;

	async function togglePluginInstallation() {
		if (localPlugin.installed) {
			await pluginStore.uninstallPlugin(localPlugin);
		} else {
			await pluginStore.installPlugin(localPlugin);
		}
		// Update the local copy to trigger reactivity
		localPlugin = { ...localPlugin, installed: !localPlugin.installed };
	}
</script>


<div
	class="grid items-center gap-4 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
	<div class="flex items-center flex-col   gap-4">
<!--		add self start to put img on top -->
		<div class="flex self-start gap-3">
		<img src={plugin.imageUrl} alt={plugin.name} width="40" height="40"  class="rounded"
																						style="aspect-ratio: 40 / 40; object-fit: cover;">
		<div class="grid gap-1.5">
			<h3 class="text-sm font-semibold">{plugin.name}</h3>
			<p class="text-xs font-medium text-gray-500 dark:text-gray-400">Version {plugin.version}</p>
		</div>
		</div>
		<p class="text-xs font-medium mt-2">
			{plugin.description}
		</p>
	</div>
	<div class="flex items-center gap-2 ml-auto">
		{#if plugin.installed}
			<button on:click={togglePluginInstallation}
							class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-primary-foreground hover:bg-destructive/90 h-9 rounded-md px-3">
				Uninstall
			</button>
		{:else}
			<button on:click={togglePluginInstallation}
							class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
				Install
			</button>
		{/if}
	</div>
</div>