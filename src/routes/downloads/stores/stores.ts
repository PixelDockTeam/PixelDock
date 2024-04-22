import { writable } from 'svelte/store';
import { fetchAllTorrentData, type TorrentData } from '../utils/torrentDataProvider';

/**
 * Initializes the torrents store.
 *
 * @return {Object} The torrents store object.
 * @property {Function} subscribe - Subscribes to changes in the torrents store.
 * @property {Function} refresh - Refreshes the torrents store by fetching all torrent data and updating it.
 * @async
 */
function initializeTorrentsStore() {
	const { subscribe, set } = writable<TorrentData[]>([]);

	return {
		subscribe,
		refresh: async () => {
			const torrents = await fetchAllTorrentData();
			set(torrents);
		}
	};
}

/**
 * Initializes the torrents store.
 *
 * @function initializeTorrentsStore
 * @returns {Object} The newly initialized torrents store.
 */
export const torrentsStore = initializeTorrentsStore();
/**
 * Represents the last updated timestamp.
 *
 * @type {number}
 * @private
 */
export const lastUpdated = writable(Date.now());