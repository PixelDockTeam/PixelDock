import { path } from '@tauri-apps/api';

export async function getPluginPath(): Promise<string> {
	return await path.join(await path.appLocalDataDir(), 'plugins');
}