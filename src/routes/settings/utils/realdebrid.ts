import { checkRealDebridData, checkRealDebridUserInfo, setRealDebridData } from '$lib';
import { RealDebridAuth } from '$lib/utils/realdebrid/auth';
import type { Writable } from 'svelte/store';
import type { RealDebridSettings } from '../types';

export const realDebridAuth = new RealDebridAuth();

export const checkForRealDebrid = async () => {
	const settings = await checkRealDebridData();
	if (settings) return settings;
	return null;
};

export const checkforRealDebridUser = async () => {
	const user = await checkRealDebridUserInfo();
	console.log(user);
	if (user) return user;
	return null;
};

export const obtainDeviceCode = async () => {
	return await realDebridAuth.obtainDeviceCode();
};

export const pollForCredentials = async (
	deviceCode: string,
	interval: number,
	expiresIn: number
) => {
	return await realDebridAuth.pollForCredentials(deviceCode, interval, expiresIn);
};

export const obtainAccessToken = async (deviceCode: string) => {
	return await realDebridAuth.obtainAccessToken(deviceCode);
};

export const setStore = async (
	credentials: Pick<RealDebridSettings, 'accessToken' | 'expires' | 'refreshToken'>,
	rdStore: Writable<RealDebridSettings | null>
) => {
	if (!realDebridAuth.clientId) throw new Error('No RealDebrid credentials found');
	if (!realDebridAuth.clientSecret) throw new Error('No RealDebrid credentials found');

	await setRealDebridData({
		...credentials,
		clientId: realDebridAuth.clientId,
		clientSecret: realDebridAuth.clientSecret
	});

	rdStore.set({
		...credentials,
		clientId: realDebridAuth.clientId,
		clientSecret: realDebridAuth.clientSecret
	});
};
