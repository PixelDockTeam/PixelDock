import { toast } from 'svelte-sonner';
import { fetch } from '@tauri-apps/api/http';

export const showToastMessage = (type: string, message: string, pluginName: string = '') => {
	type === 'success' ?
		toast.success(`${message}`, { description: `${pluginName}` })
		:
		toast.error(`${message}`, { description: `${pluginName}` });
};

export interface PackageInfo {
	name: string;
	version: string;
	description: string;
	imageUrl: string;
	fileName: string;
	installed: boolean;
}

export function getDownloadUrl(fileName: string): string {
	return `https://github.com/PixelDock-team/plugins/raw/main/${fileName}`;
}

export function validatePlugin(plugin: PackageInfo): boolean {
	if (!plugin.fileName) {
		toast.error('Plugin fileName is not defined');
		return false;
	}
	return true;
}

export const extraPluginUrls: string[] = ['https://github.com/PixelDock-team/plugins/raw/main/'];

export async function fetchPluginsFromUrl(url: string): Promise<PackageInfo[]> {
	const response = await fetch<PackageInfo[]>(`${url}plugins.json?nocache=${Date.now()}`, {
		method: 'GET',
		timeout: 30000
	});

	if (response.ok) {
		return response.data;
	}

	showToastMessage('error', `Failed to fetch available plugins from ${url}`);
	return [];
}

