<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label/index';
	import { Switch } from '$lib/components/ui/switch/index';
	import { onMount } from 'svelte';

	import RealDebridClient from '$lib/utils/realdebrid';
	import { setRealDebridUserInfo, settingsStore } from '$lib/utils/store';
	import dayjs from 'dayjs';
	import { writable } from 'svelte/store';
	import { isRealDebridModalVisible, realDebridSettings, realDebridUserInfo } from '../../stores';
	import { checkForRealDebrid, checkforRealDebridUser } from '../../utils';
	import LoginModal from '../login.modal.svelte';
	import AccountInfoRow from './sub-components/AccountInfoRow.svelte';
	import ConfirmationDialog from './sub-components/ConfirmationDialog.svelte';
	import ProviderDialog from './sub-components/ProviderDialog.svelte';

	let checkedSwitch = false;
	let open = false;

	const toggleChecked = () => {
		checkedSwitch = !checkedSwitch;
		if (!checkedSwitch) {
			open = true;
		}
	};

	onMount(async () => {
		// check for real debrid access token so that we dont do unneccessary actions
		if ($realDebridSettings === null) realDebridSettings.set(await checkForRealDebrid());
		if ($realDebridUserInfo === null || $realDebridUserInfo === 'loading')
			realDebridUserInfo.set(await checkforRealDebridUser());
	});

	realDebridSettings.subscribe(async (data) => {
		if (!data) return;
		if ($realDebridUserInfo !== 'loading' && $realDebridUserInfo !== null) return;
		if ($realDebridUserInfo) return;

		const rd = new RealDebridClient(data.accessToken);
		const userInfo = await rd.user.getUserInfo();

		if (!userInfo) return;
		realDebridUserInfo.set(userInfo);
		await setRealDebridUserInfo(userInfo);

		await settingsStore.save();
	});

	let ProviderVisible = writable<boolean>(false);
</script>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="flex flex-col gap-3 sm:flex-auto">
			<div>
				<h1 class="text-base font-semibold leading-6">Account Manager</h1>
				<p class="mt-2 text-sm text-gray-400/80">
					Enter and manage all your Premium/Gold/Platinum accounts.
				</p>
			</div>
			<div class="flex items-center space-x-2">
				<Switch on:click={toggleChecked} checked={checkedSwitch} id="airplane-mode" />

				<Label for="airplane-mode">Use Account(s) to download</Label>
				<!--				// 	TODO: store if user wants to show it again or not in alert dialog-->

				<ConfirmationDialog {open} />
			</div>
		</div>

		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<Dialog.Root bind:open={$ProviderVisible}>
				<Dialog.Trigger>
					<Button>Add Account</Button>
				</Dialog.Trigger>
				{#if $isRealDebridModalVisible === true}
					<LoginModal isVisible={ProviderVisible} {realDebridSettings} />
				{:else}
					<ProviderDialog isVisible={ProviderVisible} />
				{/if}
			</Dialog.Root>
		</div>
	</div>
	<div class="mt-8 flow-root">
		<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
				<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
					<table class="min-w-full divide-y divide-gray-500">
						<thead class="bg-slate-600/90">
							<tr>
								<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6"
									>Hoster</th
								>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold">Status</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold">Expire Date</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold">Service</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold">Manage</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-700 bg-secondary">
							{#if $realDebridUserInfo !== 'loading' && $realDebridUserInfo !== null}
								<AccountInfoRow
									name={$realDebridUserInfo?.username}
									type={$realDebridUserInfo?.type}
									date={dayjs($realDebridUserInfo?.expiration).format('DD MMM YYYY, hh:mm A')}
									service="Real Debrid"
								/>
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
