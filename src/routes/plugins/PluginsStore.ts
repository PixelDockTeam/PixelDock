import { PluginSystem } from './PluginSystem';
import { writable } from 'svelte/store';


import { fetch } from '@tauri-apps/api/http';
import {
	extraPluginUrls,
	fetchPluginsFromUrl,
	getDownloadUrl, type PackageInfo,
	showToastMessage,
	validatePlugin
} from './utils/pluginUtils';




function initializePluginManagementStore() {
	const { subscribe, set, update } = writable<PackageInfo[]>([]);
	const pluginSystem = new PluginSystem();


	const handlePluginDownload = async (url: string, pluginName: string) => {
		await pluginSystem.downloadPlugin(url, pluginName);
		await pluginSystem.loadPlugins();
		updateInstalledStatus(pluginName, true);
	};

	const updateInstalledStatus = (fileName: string, status: boolean) => {
		update(plugins => {
			return plugins.map(plugin => {
				if (plugin.fileName === fileName) {
					return { ...plugin, installed: status };
				}
				return plugin;
			});
		});
	};

	return {
		subscribe,
		fetchAvailablePlugins: async () => {
			try {
				let allPlugins: PackageInfo[] = [];

				for (const url of extraPluginUrls) {
					const plugins = await fetchPluginsFromUrl(url);
					// Check installation status for each plugin
					const pluginsWithStatus = await Promise.all(plugins.map(async (plugin) => {
						const installed = await pluginSystem.isPluginInstalled(plugin.fileName);
						return { ...plugin, installed };
					}));
					allPlugins = [...allPlugins, ...pluginsWithStatus];
				}

				set(allPlugins);
			} catch (error) {
				showToastMessage('error', 'Error fetching available plugins');
			}
		},
		addPluginRepo: (url: string) => {
			if (!extraPluginUrls.includes(url)) {
				extraPluginUrls.push(url);
			} else {
				showToastMessage('error', 'This plugin repository is already added');
			}
		},
		loadAllPlugins: async () => {
			await pluginSystem.loadPlugins();
			showToastMessage('success', 'Plugins loaded');
		},
		downloadAndLoadPlugin: async (url: string, fileName: string) => {
			try {
				await handlePluginDownload(url, fileName);
			} catch (error) {
				showToastMessage('error', `Failed downloading plugin: ${error}`);
			}
		},
		installPlugin: async (plugin: PackageInfo) => {
			try {
				if (validatePlugin(plugin)) {
					await handlePluginDownload(getDownloadUrl(plugin.fileName), plugin.fileName);
					showToastMessage('success', 'Plugin installed successfully', plugin.name);
					update(plugins => plugins.map(p => p.fileName === plugin.fileName ? { ...p, installed: true } : p));
				}
			} catch (error) {
				showToastMessage('error', 'Failed to install plugin');
			}
		},
		uninstallPlugin: async (plugin: PackageInfo) => {
			try {
				await pluginSystem.deletePlugin(plugin.fileName);
				updateInstalledStatus(plugin.fileName, false);
				showToastMessage('success', 'Plugin uninstalled successfully', plugin.name);
				update(plugins => plugins.map(p => p.fileName === plugin.fileName ? { ...p, installed: false } : p));
			} catch (error) {
				showToastMessage('error', 'Failed to uninstall plugin');
			}
		},

		// Additional methods add here if needed.
	};
}

export const pluginStore = initializePluginManagementStore();