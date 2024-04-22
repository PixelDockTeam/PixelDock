import { IGDB } from '$lib/utils/igdb/client';

// interface Pagination {
// 	offset: number;
// 	limit: number;
// }

export interface ProviderResponse {
	title: string;
	group: string | null;
	id: string;
	url: string;
	[x: string]: unknown;
}

export interface SpecsInfo {
	os_info?: string;
	cpu_info?: string;
	ram_info?: string;
	gpu_info?: string;
	// Add more properties if there are more specs info fields
}
export interface ProviderInfoResponse {
	title: string;
	group: string | null;
	downloads: Link[];
	image: string;
	screenshots: string[];
	fileSize?: string;
	repackSize?: string;
	specs?: SpecsInfo; // Add the specs property
	[x: string]: unknown;
}

export interface Link {
	url: string;
	name: string;
}

class Fetcher {
	private igdb = new IGDB();

	async igdbSearch(query: string) {
		return await this.igdb.search(query);
	}

	async igdbInfo(id: string) {
		return await this.igdb.info(id);
	}

	async igdbTopRated() {
		return await this.igdb.topRated();
	}

	async igdbMostAnticipated() {
		return await this.igdb.mostAnticipated();
	}
}

export default new Fetcher();
