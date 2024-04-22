export interface IPlugin {
	name: string;
	version: string;
	search: (query: string) => Promise<string[]>;
}