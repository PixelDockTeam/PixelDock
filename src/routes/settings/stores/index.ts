import type { RDUser, RqbitDesktopConfig } from '$lib';
import { writable } from 'svelte/store';
import type { RealDebridSettings } from '../types';

export const realDebridSettings = writable<RealDebridSettings | null>(null);
export const realDebridUserInfo = writable<RDUser | null | 'loading'>('loading');

export const isRealDebridModalVisible = writable<boolean>(false);
// export const UserConfiguration = writable<CurrentDesktopState>({
// config: null,
// 	configured: false
// });
// UserConfiguration.set({config.dht})
export const torrentConfigStore = writable<RqbitDesktopConfig | null>(null);