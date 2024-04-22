<script lang="ts">
	import { fetchConfigurations, resetToDefaultConfig, saveConfig } from '../../utils/ConfigManagment';
	import { onMount } from 'svelte';
	import type { CurrentDesktopState, RDUser, RqbitDesktopConfig } from '$lib';
	import { torrentConfigStore } from '../../stores';
	import DownloadPathSelector from './DownloadPathSelector.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import DhtConfiguration from './DhtConfiguration.svelte';

	onMount(() => {
		fetchConfigurations();
		resetToDefaultConfig();
	});

	// let updatedConfig: RqbitDesktopConfig = {
	// 	default_download_location: '',
	// 	dht: null,
	// 	tcp_listen: null,
	// 	upnp:null,
	// 	persistence: null,
	// 	peer_opts: null,
	// 	http_api: null,
	// };
	// $: if ($torrentConfigStore) {
	// 	updatedConfig = $torrentConfigStore;
	// }
	//
	//
	// async function save() {
	// 	await saveConfig(updatedConfig);
	// }
</script>
<!--pb class here -->
<h1 class="text-red-500 text-xl">DO NOT TOUCH RADIOCTIVE, AND PAINFUL EXPERIENCE AWAITS</h1>
<div class="px-4 sm:px-6 lg:px-8 pb-20">
	<div class="sm:flex sm:items-center">


		<div class="sm:flex-auto flex flex-col divide-y-2 gap-3">
			<div>
				<h1 class="text-base font-semibold leading-6 ">Torrent Client Configuration</h1>
				<p class="mt-2 text-sm text-gray-400/80">
					Configure your torrent client for optimal download performance and user customization.
				</p>
			</div>
			<!--			<form on:submit|preventDefault={save}>-->
			<!--				&lt;!&ndash; Directly bind to the property without optional chaining &ndash;&gt;-->
			<!--				<input type="text" bind:value={updatedConfig.default_download_location} placeholder="Default Download Location">-->
			<!--				<button type="submit">Save</button>-->
			<!--			</form>-->


			<section class="grid  gap-x-18   py-12  md:grid-cols-3">
				<div>
					<h2 class="text-base font-semibold leading-7 text-white">Download Directory Setup</h2>
					<p class="mt-1 text-sm leading-6 text-gray-400">Set the directory for storing downloaded torrent files.
					</p>
				</div>
				<DownloadPathSelector />

			</section>
			<DhtConfiguration />
		</div>
	</div>

</div>
