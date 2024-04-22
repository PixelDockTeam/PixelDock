import { getPluginPath } from './utils/pathUtils';
import { readDir, readTextFile, writeFile } from './utils/fileUtils';
import type { IPlugin } from './interfaces/IPlugin';

import { fs, path } from '@tauri-apps/api';
import { fetch, ResponseType } from '@tauri-apps/api/http';

export class PluginSystem {
	private async getPluginPath(): Promise<string> {
		return await getPluginPath();
	}

	async loadPlugins(): Promise<void> {
		const pluginDir = await this.getPluginPath();
		const files = await readDir(pluginDir);

		for await (const file of files) {

			await this.loadPlugin(file.path);
		}
	}


	async loadPlugin(filePath: string): Promise<void> {
		const code = (await readTextFile(filePath)).replaceAll('from ', '');

		const blob = new Blob([code], { type: 'application/javascript' });
		const blobUrl = URL.createObjectURL(blob);

		const module = await import(/* @vite-ignore */ blobUrl);
		const PluginClass: { new(): IPlugin } = module.default;
		const pluginInstance: IPlugin = new PluginClass();
		const searchResults = await pluginInstance.search('God Of War');

		// Convert the result to JSON
		const searchResultsJson = JSON.stringify(searchResults);
		console.log(searchResultsJson);
	}


	async downloadPlugin(url: string, fileName: string): Promise<void> {
		const pluginDir = await this.getPluginPath();
		const pluginDirExist = await fs.exists(pluginDir);
		const pluginInstalled = await this.isPluginInstalled(fileName);
		if (pluginInstalled) {
			throw new Error('Plugin already installed');
		}
		if (!pluginDirExist) {
			await fs.createDir(pluginDir);
		}

		const pluginPath = await path.join(pluginDir, fileName);
		const response = await fetch(url, {
			method: 'GET',
			responseType: ResponseType.Text
		});
		console.log("response",response);
		if (!response.ok) throw new Error(response.statusText);
		await writeFile(pluginPath, response.data as string);
	}
	async isPluginInstalled(fileName: string): Promise<boolean> {
		const pluginDir = await this.getPluginPath();
		const pluginPath = await path.join(pluginDir, fileName);
		return await fs.exists(pluginPath);
	}
	async deletePlugin(fileName: string): Promise<void> {
		const pluginDir = await this.getPluginPath();
		const pluginPath = await path.join(pluginDir, fileName);
		await fs.removeFile(pluginPath);
	}
}