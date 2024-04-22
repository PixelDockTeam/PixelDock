<script lang="ts">
	import { get, writable } from 'svelte/store';
	import { open } from '@tauri-apps/api/dialog';
	import { torrentConfigStore } from '../../stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
	import { saveConfig } from '../../utils/ConfigManagment';
	import type { RqbitDesktopConfig } from '$lib'; // Ensure this import path is correct

	let downloadPath = writable<string | null>(null);

	async function selectDownloadFolder() {
		try {
			const selected = await open({
				directory: true,
				multiple: false,
				title: 'Select Download Folder'
			});
			if (selected && typeof selected === 'string') {
				downloadPath.set(selected);
				const currentConfig = get(torrentConfigStore);
				if (currentConfig) {
					const updatedConfig: RqbitDesktopConfig = {
						...currentConfig,
						default_download_location: selected
					};
					await saveConfig(updatedConfig);
					torrentConfigStore.set(updatedConfig);
				}
			}
		} catch (error) {
			console.error('Error selecting folder:', error);
		}
	}
</script>


<div class="md:col-span-2 flex flex-col gap-4">
	<div class="flex w-full flex-col gap-1.5">
		<Label for="downloadPath">Current Download Directory</Label>
		<Input disabled type="text" id="downloadPath"
					 placeholder="{$downloadPath || $torrentConfigStore?.default_download_location}" />
	</div>
	<Button size="sm" class="w-fit" on:click={selectDownloadFolder}>Choose Directory</Button>
</div>
