import type { CurrentDesktopState, InvokeErrorResponse, RqbitAPI, RqbitDesktopConfig } from '$lib';
import { makeAPI } from '$lib/utils/rqbit/api';
import { invoke } from '@tauri-apps/api/tauri';
import { toast } from 'svelte-sonner';
import { writable } from 'svelte/store';

/**
 * The default configuration value.
 *
 * @type {string}
 * @constant
 * @default 'config_default'
 */
const DEFAULT_CONFIG = 'config_default';
/**
 * Represents the current configuration setting.
 *
 * @type {string}
 * @constant
 * @default
 */
const CURRENT_CONFIG = 'config_current';
/**
 * Represents the constant variable `CHANGE_CONFIG`.
 *
 * @const
 * @type {string}
 */
const CHANGE_CONFIG = 'config_change';

/**
 * Represents an instance of the RqbitAPI.
 * This class provides methods to interact with the RqbitAPI service.
 * @class
 * @constructor
 */
let apiInstance: RqbitAPI;
/**
 * Represents the configuration status of a certain component.
 *
 * @property {boolean} isConfigured - Indicates if the component is currently configured.
 */
export const isConfigured = writable(false);
/**
 * @typedef {Object} RqbitAPI
 * @property {function} method1 - description of method1
 * @property {function} method2 - description of method2
 * ...
 */
export const rqbitStore = writable<RqbitAPI | null>(null);

/**
 * Initializes the Rqbit store.
 *
 * @return {Promise<void>} - A promise that resolves when the store is initialized.
 */
export async function initializeRqbitStore() {
	// Call the initialization function
	const api = await InitializeRqbit();
	// Update the Svelte store with the received API instance
	rqbitStore.set(api);
}

/**
 * Initializes the Rqbit API.
 *
 * @returns {Promise<RqbitAPI>} A promise that resolves to the initialized Rqbit API instance.
 * @throws {InvokeErrorResponse} If initialization fails, an error is thrown.
 */
export async function InitializeRqbit(): Promise<RqbitAPI> {
	try {
		const defaultConfig = await invoke<RqbitDesktopConfig>(DEFAULT_CONFIG);
		const currentConfig = await invoke<CurrentDesktopState>(CURRENT_CONFIG);
		isConfigured.set(currentConfig.configured || false);

		// Initialize API with either current or default configuration
		apiInstance = makeAPI(currentConfig.config ?? defaultConfig);
		toast.success('Successfully Initialize Rqbit');
		if (!currentConfig.configured) {
			console.log('Application is not configured. Initializing with default settings.');
			toast.info('Application is not configured. Initializing with default settings.'); // Toast notification here
			await setDefaultAsCurrentConfig(defaultConfig);
		}

		return apiInstance;
	} catch (error) {
		const err = error as InvokeErrorResponse;
		console.error('Initialization failure:', err);
		toast.error(`Initialization failed with error: ${err.status_text}`);
		throw error;
	}
}

/**
 * Sets the given default configuration as the current config and initializes the application with the default settings.
 *
 * @param {RqbitDesktopConfig} defaultConfig - The default configuration to set as the current config.
 *
 * @return {Promise<void>} - A promise that resolves when the default configuration is set and the application is initialized successfully.
 *                          If an error occurs during initialization, the promise will be rejected with an error object.
 *
 * @throws {InvokeErrorResponse} - If an error occurs while invoking the CHANGE_CONFIG method.
 */
async function setDefaultAsCurrentConfig(defaultConfig: RqbitDesktopConfig) {
	try {
		await invoke(CHANGE_CONFIG, { config: defaultConfig });
		isConfigured.set(true);
		console.log('Application has been initialized with default settings.');
		toast.success('Application has been initialized with default settings.');

		apiInstance = makeAPI(defaultConfig);
	} catch (error) {
		const err = error as InvokeErrorResponse;
		console.error('Failed to initialize application:', err);
		toast.error(`Failed to initialize application with error: ${err.status_text}`);
	}
}
