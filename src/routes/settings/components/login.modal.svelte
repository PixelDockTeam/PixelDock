<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { writeText } from '@tauri-apps/api/clipboard';
	import { open } from '@tauri-apps/api/shell';
	import { toast } from 'svelte-sonner';
	import { writable, type Writable } from 'svelte/store';
	import { isRealDebridModalVisible } from '../stores';
	import type { RealDebridSettings } from '../types';
	import * as rd from '../utils/realdebrid';

	interface ProgressBarType {
		startCountdown: () => void;
		stopCountdown: () => void;
	}

	let progressBar: ProgressBarType;
	export let isVisible = writable<boolean>();
	export let realDebridSettings: Writable<RealDebridSettings | null>;

	let startCountdown: boolean = false;
	let isProgressBarMounted = false;

	let deviceCodeInfo: Writable<{
		device_code: string;
		user_code: string;
		interval: string;
		expires_in: string;
		verification_url: string;
	} | null> = writable(null);

	const openRealDebrid = async () => {
		if (!$deviceCodeInfo?.user_code) return;

		await writeText($deviceCodeInfo.user_code);
		toast.success(`Copied ${$deviceCodeInfo.user_code} to clipboard`, {
			position: 'bottom-center'
		});

		await open('https://real-debrid.com/device');
		isVisible.set(true);
	};

	// on visible change, obtain device code, which is a async function
	isVisible.subscribe(async () => {
		if ($isVisible) {
			const data = await rd.obtainDeviceCode();
			if (!data) return;
			deviceCodeInfo.set(data);
		}
	});

	deviceCodeInfo.subscribe(async () => {
		if ($deviceCodeInfo && isVisible) {
			try {
				const credentials = await rd.pollForCredentials(
					$deviceCodeInfo.device_code,
					parseInt($deviceCodeInfo.interval),
					parseInt($deviceCodeInfo.expires_in)
				);

				if (!credentials) return;

				const data = await rd.obtainAccessToken($deviceCodeInfo.device_code);

				await rd.setStore(
					{
						accessToken: data.access_token,
						refreshToken: data.refresh_token,
						expires: data.expires_in
					},
					realDebridSettings
				);

				isVisible.set(false);
				isRealDebridModalVisible.set(false);
			} catch (error) {
				throw new Error((error as Error).message);
			}
		}
	});

	const cancel = () => {
		isVisible.set(false);
		isRealDebridModalVisible.set(false);
		// progressBar.stopCountdown();
		deviceCodeInfo.set(null);
	};

	const onProgressBarMounted = () => {
		isProgressBarMounted = true;
	};
	//
</script>

<Dialog.Content>
	<Dialog.Header>
		<Dialog.Title>Log in with real debrid</Dialog.Title>
		<Dialog.Description>
			{#if !$deviceCodeInfo}
				<div>loading...</div>
			{:else}
				<div>
					<ul>
						<li>
							Goto: <span class="text-primary underline">{$deviceCodeInfo.verification_url}</span>
						</li>
						<li>Code: <strong>{$deviceCodeInfo.user_code}</strong></li>
						<li>Expires <strong>{$deviceCodeInfo.expires_in} seconds</strong></li>
					</ul>
				</div>
			{/if}
		</Dialog.Description>
	</Dialog.Header>
	<Dialog.Footer>
		<Button variant="destructive" on:click={cancel}>Cancel</Button>
		<Button on:click={openRealDebrid}>Open Real Debrid</Button>
	</Dialog.Footer>
</Dialog.Content>
