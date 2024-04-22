import type { AddTorrentResponse, TorrentStats } from '$lib/@types/rqbit.types';
import { toast } from 'svelte-sonner';
import { get } from 'svelte/store';
import { lastUpdated } from '../stores/stores';
import { rqbitStore } from './rqbitController';
import { goto } from '$app/navigation';

/**
 * Retrieves the details of a torrent with the given ID
 * @param {number} id - The ID of the torrent to retrieve details for
 * @return {Promise<TorrentData>} - A promise that resolves to the torrent details
 * @throws {Error} - If the details could not be fetched for the torrent with the given ID
 */
async function retrieveTorrentDetails(id: number): Promise<TorrentData> {
	const details = await get(rqbitStore)?.getTorrentDetails(id);

	if (!details) {
		toast.error(`Failed to fetch details for torrent with id ${id}`);
		throw new Error(`Failed to fetch details for torrent with id ${id}`);
	}

	return {
		id,
		name: details.name || 'N/A',
		stats: await get(rqbitStore)?.getTorrentStats(id)
	};
}

/**
 * Represents the data for a torrent.
 * @interface
 */
export interface TorrentData {
	id: number;
	name: string;
	stats: TorrentStats | undefined;
}

/**
 * Fetches all torrent data.
 *
 * @returns {Promise<TorrentData[]>} A promise that resolves to an array of TorrentData objects.
 */
export async function fetchAllTorrentData(): Promise<TorrentData[]> {
	if (!get(rqbitStore)) return [];

	const torrentListResponse = await get(rqbitStore)?.listTorrents();

	if (!torrentListResponse || !torrentListResponse.torrents) {
		toast.error('TorrentList response or torrents list is undefined');
		console.error('TorrentList response or torrents list is undefined');
		return [];
	}

	const torrents = await Promise.all(
		torrentListResponse.torrents.map((torrent) => retrieveTorrentDetails(torrent?.id))
	);
	return torrents;
}

export async function listTorrentMagnet(magnetUrl: string): Promise<AddTorrentResponse | undefined> {
	if (!get(rqbitStore)) {
		toast.error("RqBit not initialized");
		return undefined;
	}
	const addTrntResp = await get(rqbitStore)?.uploadTorrent(magnetUrl, { list_only: true })
	toast.message("Successfully fetched torrent.")
	console.log(addTrntResp);
	return addTrntResp
}
export async function startTorrentMagnet(magnetUrl: string): Promise<AddTorrentResponse | undefined> {
	if (!get(rqbitStore)) {
		toast.error("RqBit not initialized");
		return undefined;
	}
	const addTrntResp = await get(rqbitStore)?.uploadTorrent(magnetUrl)
	toast.message("Successfully started download.")
	console.log(addTrntResp);
	await goto("/downloads")
}
/**
 * Starts an auto refresh feature at the specified interval.
 *
 * @param {number} interval - The time interval between each auto refresh.
 *
 * @return {number} - The ID of the interval. This can be used to stop the auto refresh using the clearInterval function.
 */
export function startAutoRefresh(interval: number) {
	return setInterval(() => {
		lastUpdated.set(Date.now());
	}, interval);
}
