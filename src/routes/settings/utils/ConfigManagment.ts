import type { CurrentDesktopState, RqbitDesktopConfig } from '$lib';
import { invoke } from '@tauri-apps/api/tauri';
import { toast } from 'svelte-sonner';
import { isConfigured } from '../../downloads/utils/rqbitController';
import { torrentConfigStore } from '../stores';

export async function fetchConfigurations(): Promise<void> {
	try {
		const defaultConfig: RqbitDesktopConfig = await invoke('config_default');
		const currentConfig: CurrentDesktopState = await invoke('config_current');
		isConfigured.set(currentConfig.configured || false);

		torrentConfigStore.set(currentConfig.config ?? defaultConfig);
	} catch (error) {
		console.error('Failed to fetch configurations:', error);
		toast.error('Failed to fetch configurations.');
	}
}

export async function saveConfig(updatedConfig: RqbitDesktopConfig): Promise<void> {
	try {
		await invoke('config_change', { config: updatedConfig });
		isConfigured.set(true);
		torrentConfigStore.set(updatedConfig);

		toast.success('Configuration saved successfully.');
	} catch (error) {
		console.error('Failed to save configuration:', error);
		toast.error('Failed to save configuration.');
	}
}

export async function resetToDefaultConfig(): Promise<void> {
	try {
		// Fetch the default configuration
		const defaultConfig: RqbitDesktopConfig = await invoke('config_default');

		// Save the default configuration as the current configuration
		await saveConfig(defaultConfig);

		// Optionally, you might want to update the `isConfigured` state if necessary
		// For example, if resetting to default should also affect this state
		isConfigured.set(true);

		toast.success('Configuration reset to default successfully.');
	} catch (error) {
		console.error('Failed to reset configuration to default:', error);
		toast.error('Failed to reset configuration to default.');
	}
}
