import { fs } from '@tauri-apps/api';
import type { FileEntry } from '@tauri-apps/api/fs';

export async function readDir(dir: string): Promise<FileEntry[]> {
	return await fs.readDir(dir);
}

export async function readTextFile(filePath: string): Promise<string> {
	return await fs.readTextFile(filePath);
}

export async function writeFile(filePath: string, data: string): Promise<void> {
	return await fs.writeFile(filePath, data);
}