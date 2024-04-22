export type TupMinMax<
	T,
	Min extends number,
	Max extends number,
	A extends (T | undefined)[] = [],
	O extends boolean = false
> = O extends false
	? Min extends A['length']
		? TupMinMax<T, Min, Max, A, true>
		: TupMinMax<T, Min, Max, [...A, T], false>
	: Max extends A['length']
		? A
		: TupMinMax<T, Min, Max, [...A, T?], false>;

export interface IGDBData {
	id: number;
	age_ratings?: number[];
	alternative_names?: number[];
	artworks?: IGDBDataImage[];
	category: number;
	collection?: number;
	cover: IGDBDataImage;
	created_at: number;
	external_games?: number[];
	first_release_date: number;
	follows?: number;
	game_engines?: GameEngine[];
	game_modes: number[];
	genres: Genre[];
	hypes: number;
	involved_companies: InvolvedCompany[];
	keywords?: number[];
	multiplayer_modes?: number[];
	name: string;
	parent_game?: number;
	platforms: Platform[];
	player_perspectives: number[];
	rating: number;
	rating_count: number;
	release_dates: ReleaseDate[];
	screenshots?: IGDBDataImage[];
	similar_games: SimilarGame[];
	slug: string;
	storyline?: string;
	summary: string;
	tags: number[];
	themes: number[];
	total_rating: number;
	total_rating_count: number;
	updated_at: number;
	url: string;
	videos?: Video[];
	websites: Website[];
	checksum: string;
	language_supports?: number[];
	game_localizations?: number[];
	collections?: number[];
	aggregated_rating?: number;
	aggregated_rating_count?: number;
	bundles?: number[];
	expansions?: number[];
	franchises?: number[];
	standalone_expansions?: number[];
	dlcs?: number[];
	expanded_games?: number[];
	hltb: HLTBSearch;
}

export interface HLTBSearch {
	id: string;
	name: string;
	description: string;
	platforms: string[];
	imageUrl: string;
	timeLabels: Array<string[]>;
	gameplayMain: number;
	gameplayMainExtra: number;
	gameplayCompletionist: number;
	similarity: number;
	searchTerm: string;
	playableOn: string[];
}

export interface IGDBDataImage {
	id: number;
	alpha_channel: boolean;
	animated: boolean;
	game: number;
	height: number;
	image_id: string;
	url: string;
	width: number;
	checksum: string;
}

export interface GameEngine {
	id: number;
	created_at: number;
	name: string;
	slug: string;
	updated_at: number;
	url: string;
	checksum: string;
	companies?: number[];
	logo?: number;
	platforms?: number[];
}

export interface Genre {
	id: number;
	created_at: number;
	name: string;
	slug: string;
	updated_at: number;
	url: string;
	checksum: string;
}

export interface InvolvedCompany {
	id: number;
	company: number;
	created_at: number;
	developer: boolean;
	game: number;
	porting: boolean;
	publisher: boolean;
	supporting: boolean;
	updated_at: number;
	checksum: string;
}

export interface Platform {
	id: number;
	abbreviation: string;
	alternative_name?: string;
	category: number;
	created_at: number;
	name: string;
	platform_logo: number;
	slug: string;
	updated_at: number;
	url: string;
	versions: number[];
	websites?: number[];
	checksum: string;
	generation?: number;
	platform_family?: number;
	summary?: string;
}

export interface ReleaseDate {
	id: number;
	category: number;
	created_at: number;
	date?: number;
	game: number;
	human: string;
	m?: number;
	platform: number;
	region: number;
	updated_at: number;
	y?: number;
	checksum: string;
	status?: number;
}

export interface SimilarGame {
	id: number;
	age_ratings?: number[];
	aggregated_rating?: number;
	aggregated_rating_count?: number;
	artworks?: number[];
	category: number;
	cover: GameEngineClass | number;
	created_at: number;
	external_games: number[];
	first_release_date?: number;
	follows?: number;
	game_modes?: number[];
	genres: Array<GameEngineClass | number>;
	involved_companies?: Array<GameEngineClass | number>;
	keywords?: number[];
	multiplayer_modes?: number[];
	name: string;
	platforms: Array<GameEngineClass | number>;
	player_perspectives?: number[];
	rating?: number;
	rating_count?: number;
	release_dates: Array<GameEngineClass | number>;
	screenshots?: Array<GameEngineClass | number>;
	similar_games: Array<GameEngineClass | number>;
	slug: string;
	storyline?: string;
	summary: string;
	tags: number[];
	themes: number[];
	total_rating?: number;
	total_rating_count?: number;
	updated_at: number;
	url: string;
	videos?: Array<GameEngineClass | number>;
	websites: Array<GameEngineClass | number>;
	checksum: string;
	language_supports?: number[];
	alternative_names?: number[];
	bundles?: number[];
	dlcs?: number[];
	expansions?: number[];
	franchises?: number[];
	game_engines?: Array<GameEngineClass | number>;
	hypes?: number;
	game_localizations?: number[];
	collections?: number[];
	collection?: number;
	status?: number;
	expanded_games?: number[];
	standalone_expansions?: number[];
	remasters?: number[];
	ports?: number[];
	franchise?: number;
	remakes?: number[];
}

export interface GameEngineClass {
	id: number;
}

export interface Video {
	id: number;
	game: number;
	name: string;
	video_id: string;
	checksum: string;
}

export interface Website {
	id: number;
	category: number;
	game: number;
	trusted: boolean;
	url: string;
	checksum: string;
}
export interface Game {
	id?: number;
	name: string;
	path: string;
	coverID: string;
	gameID: string;
}
export type IGDBImageSize =
	| 'original'
	| 'cover_small'
	| 'screenshot_med'
	| 'cover_big'
	| 'logo_med'
	| 'screenshot_big'
	| 'screenshot_huge'
	| 'thumb'
	| 'micro'
	| '720p'
	| '1080p';

export interface RDUser {
	id: number;
	username: string;
	email: string;
	points: number; // Fidelity points
	locale: string; // User language
	avatar: string; // URL
	type: string; // "premium" or "free"
	premium: number; // seconds left as a Premium user
	expiration: string; // jsonDate
}
