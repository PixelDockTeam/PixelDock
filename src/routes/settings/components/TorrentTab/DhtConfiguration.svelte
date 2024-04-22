<script lang="ts">
	import { onDestroy } from 'svelte';
	import { torrentConfigStore } from '../../stores/index';
	import { Switch } from '$lib/components/ui/switch/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index';
	import { saveConfig } from '../../utils/ConfigManagment';
	import type { RqbitDesktopConfig } from '$lib';
	import { get } from 'svelte/store';
	import { toast } from 'svelte-sonner';

	let disableDHT: boolean = false;
	let disablePersistence: boolean = false;
	let persistenceFilename: string = '';

	const unsubscribe = torrentConfigStore.subscribe(($torrentConfigStore) => {
		if ($torrentConfigStore?.dht) {
			disableDHT = $torrentConfigStore.dht.disable;
			disablePersistence = $torrentConfigStore.dht.disable_persistence;
			persistenceFilename = $torrentConfigStore.dht.persistence_filename;
		}
	});

	onDestroy(unsubscribe);

	// Reactive statements to handle changes
	$: if (disableDHT !== undefined) {
		updateDHTConfig(disableDHT, 'disable');
	}
	$: if (disablePersistence !== undefined) {
		updateDHTConfig(disablePersistence, 'disable_persistence');
	}

	async function updateDHTConfig(newValue: boolean, configKey: 'disable' | 'disable_persistence') {
		const currentConfig: RqbitDesktopConfig = get(torrentConfigStore);
		const updatedConfig: RqbitDesktopConfig = {
			...currentConfig,
			dht: {
				...currentConfig.dht,
				[configKey]: newValue,
				persistence_filename: persistenceFilename
			}
		};

		try {
			await saveConfig(updatedConfig);
			torrentConfigStore.set(updatedConfig);
			toast.success('DHT configuration updated successfully.');
		} catch (error) {
			console.error('Failed to update DHT configuration:', error);
			toast.error('Failed to update DHT configuration.');
		}
	}
</script>


<section class="grid gap-x-18 py-12 md:grid-cols-3">
	<div>
		<h2 class="text-base font-semibold leading-7 text-white">DHT Configuration</h2>
		<p class="mt-1 text-sm leading-6 text-gray-400">
			The Distributed Hash Table (DHT) configuration allows for fine-tuning how decentralized peer-to-peer file sharing
			operates.
		</p>
	</div>
	<div class="md:col-span-2 flex flex-col gap-4">
		<div class="flex w-full flex-col gap-5">
			<div class="flex items-center space-x-2">

				<Switch id="dht" bind:checked={disableDHT} on:click={() => updateDHTConfig(!disableDHT, 'disable')} />
				<Label for="dht" class="text-sm text-slate-300"> Enable or Disable DHT functionality</Label>
			</div>
			<div class="flex items-center space-x-2">
				<Switch id="dhtpersistance" bind:checked={disablePersistence} on:click={updateDHTConfig} />
				<Label for="dhtpersistance-mode" class="text-sm text-slate-300">Determines whether the DHT table is persistent
					between application restarts.</Label>
			</div>
			<div class="flex w-full flex-col gap-1.5">
				<Label for="PersistenceFilename">Persistence Filename:</Label>
				<Input type="text" id="PersistenceFilename" bind:value={persistenceFilename} on:input={updateDHTConfig} />
			</div>
		</div>
	</div>
</section>
