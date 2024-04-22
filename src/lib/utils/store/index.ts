import type { RDUser } from '$lib';
import { Store } from 'tauri-plugin-store-api';
import type { RealDebridSettings } from '../../../routes/settings/types';

export const settingsStore = new Store('.settings.dat');

export const setRealDebridData = async (credentials: RealDebridSettings) => {
	await settingsStore.set('real-debrid', credentials);
};

export const checkRealDebridData = async () => {
	const credentials = await settingsStore.get<RealDebridSettings>('real-debrid');
	if (!credentials) return null;
	return credentials;
};

export const checkRealDebridUserInfo = async () => {
	const user = await settingsStore.get<RDUser>('real-debrid-user');
	if (!user) return null;
	return user;
};

export const setRealDebridUserInfo = async (user: RDUser) => {
	await settingsStore.set('real-debrid-user', user);
};
