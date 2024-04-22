<script lang="ts">
	import { setRealDebridUserInfo, settingsStore } from '$lib';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import RealDebridClient from '$lib/utils/realdebrid';
	import { Blocks, CandyCane, Cog, FileCog, FlaskConical, UserCog } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import AccountManager from './components/AccountsTab/AccountManager.svelte';
	import Plugins from './components/PluginsTab/Plugins.svelte';
	import TorrentConfiguration from './components/TorrentTab/TorrentConfiguration.svelte';
	import { realDebridSettings, realDebridUserInfo } from './stores';
	import { checkForRealDebrid, checkforRealDebridUser } from './utils';
	import DownloadPathSelector from './components/TorrentTab/DownloadPathSelector.svelte';

	import ThemeComboBox from './components/ThemeComboBox.svelte';
	import { Button } from '$lib/components/ui/button';

	let currentTab = 1;
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

</script>

<!-- 
  TODO: 
  settings to add:
  torrent client settings: max downloads, max speed etc etc;
  colour scheme;
  on/off toggle for providers;
  add to steam shortcut (steam deck)
  automated install (windows)
  we could have plugins, and remove download option and make it a plugin, then release it on reddit/ foss
  change default download location
  developer options like dumb logs

  jdownloader intergration
-->

<!--<MainContainer>-->
<!--	<div class="w-full">-->
<!--		{#if !$realDebridSettings}-->
<!--			<AlertDialog.Root bind:open={$isModalVisible}>-->
<!--				<AlertDialog.Trigger>-->
<!--					<Button>Login to Real Debrid</Button>-->
<!--				</AlertDialog.Trigger>-->
<!--				<RealDebridModal isVisible={isModalVisible} {realDebridSettings} />-->
<!--			</AlertDialog.Root>-->
<!--		{:else if $realDebridUserInfo === 'loading'}-->
<!--			<p>loading...</p>-->
<!--		{:else if !$realDebridUserInfo}-->
<!--			<p>Error</p>-->
<!--		{:else if $realDebridUserInfo}-->
<!--			<div class="flex flex-col gap-2">-->
<!--				<div class="flex flex-row gap-3">-->
<!--					<span class="w-24 font-bold">Username: </span>-->
<!--					{$realDebridUserInfo?.username}-->
<!--				</div>-->
<!--				<div class="flex flex-row gap-3">-->
<!--					<span class="w-24 font-bold">Type: </span>-->
<!--					{$realDebridUserInfo?.type}-->
<!--				</div>-->
<!--				<div class="flex flex-row gap-3">-->
<!--					<span class="w-24 font-bold">Expires: </span>-->
<!--					{dayjs($realDebridUserInfo?.expiration).format('DD MMM YYYY, hh:mm A')}-->
<!--				</div>-->
<!--			</div>-->
<!--		{/if}-->
<!--	</div>-->
<!--</MainContainer>-->
<main class="relative h-[630px] overflow-hidden pt-6 2xl:h-5/6">
	<div class="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
		<div class="border-b px-4 py-2 sm:px-6">
			<div class="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
				<div class="mt-2">
					<h3 class="text-lg font-semibold leading-6">Settings</h3>
				</div>
			</div>
		</div>
		<div class="mt-6 overflow-hidden rounded-lg bg-secondary/70 shadow">
			<div class="divide-y divide-slate-700 lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
				<aside class="py-6 lg:col-span-3">
					<nav class="space-y-1">
						<button
							on:click={() => (currentTab = 1)}
							class="{currentTab === 1
								? 'border-teal-500 bg-primary'
								: 'border-none'}  group flex w-full items-center border-l-4 px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/70 hover:text-foreground/80"
							aria-current="page"
						>
							<Cog
								class="-ml-1 mr-3 h-6 w-6 flex-shrink-0 text-foreground group-hover:text-teal-500"
							/>
							<span class="truncate">General</span>
						</button>
						<button
							on:click={() => (currentTab = 2)}
							class="{currentTab === 2
								? 'border-teal-500 bg-primary'
								: 'border-none'}  group flex w-full items-center border-l-4 px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/70 hover:text-foreground/80"
							aria-current="page"
						>
							<FileCog
								class="-ml-1 mr-3 h-6 w-6 flex-shrink-0 text-foreground group-hover:text-teal-500"
							/>
							<span class="truncate">Torrent Configuration</span>
						</button>
						<button
							on:click={() => (currentTab = 3)}
							class="{currentTab === 3
								? 'border-teal-500 bg-primary'
								: 'border-none'}  group flex w-full items-center border-l-4 px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/70 hover:text-foreground/80"
							aria-current="page"
						>
							<UserCog
								class="-ml-1 mr-3 h-6 w-6 flex-shrink-0 text-foreground group-hover:text-teal-500"
							/>
							<span class="truncate">Accounts</span>
						</button>
						<button
							on:click={() => (currentTab = 4)}
							class="{currentTab === 4
								? 'border-teal-500 bg-primary'
								: 'border-none'}  group flex w-full items-center border-l-4 px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/70 hover:text-foreground/80"
							aria-current="page"
						>
							<Blocks
								class="-ml-1 mr-3 h-6 w-6 flex-shrink-0 text-foreground group-hover:text-teal-500"
							/>
							<span class="truncate">Plugins</span>
						</button>
						<button
							on:click={() => (currentTab = 5)}
							class="{currentTab === 5
								? 'border-teal-500 bg-primary'
								: 'border-none'}  group flex w-full items-center border-l-4 px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/70 hover:text-foreground/80"
							aria-current="page"
						>
							<FlaskConical
								class="-ml-1 mr-3 h-6 w-6 flex-shrink-0 text-foreground group-hover:text-teal-500"
							/>
							<span class="truncate">Developer</span>
						</button>
						<button
							on:click={() => (currentTab = 6)}
							class="{currentTab === 6
								? 'border-teal-500 bg-primary'
								: 'border-none'}  group flex w-full items-center border-l-4 px-3 py-2 text-sm font-medium text-foreground hover:bg-primary/70 hover:text-foreground/80"
							aria-current="page"
						>
							<CandyCane
								class="-ml-1 mr-3 h-6 w-6 flex-shrink-0 text-foreground group-hover:text-teal-500"
							/>
							<span class="truncate">Misc</span>
						</button>
					</nav>
				</aside>
				<section class="col-span-9 w-full  p-6 py-6">
					{#if currentTab === 1}
						<!-- General tab content goes here -->
						<ScrollArea class="h-[650px] w-full rounded-md p-4   2xl:h-5/6">
							<div class="px-4 sm:px-6 lg:px-8 pb-96 ">
								<div class="sm:flex sm:items-center">


									<div class="sm:flex-auto  flex flex-col divide-y-2 gap-4">
										<div>
											<h1 class="text-base font-semibold leading-6 ">General Configuration</h1>
											<p class="mt-2 text-sm text-gray-400/80">
												Customize your app experience with our easy-to-use General Configuration settings.
											</p>
										</div>

										<section class="grid  gap-x-10   py-12 grid-cols-3">
											<div>
												<h2 class="text-base font-semibold leading-7 text-white">Download Directory Setup</h2>
												<p class="mt-1 text-sm leading-6 text-gray-400">Set the directory for storing downloaded torrent
													files.
												</p>
											</div>
											<DownloadPathSelector />

										</section>

										<section class="grid  gap-x-10   py-12 grid-cols-3">
											<div>
												<h2 class="text-base font-semibold leading-7 text-white">Choose your Theme</h2>
												<p class="mt-1 text-sm leading-6 text-gray-400">Select your favorite theme to personalize the
													app's appearance to your liking.
												</p>
											</div>
											<div class="md:col-span-2 flex flex-col gap-4">
												<ThemeComboBox />
												<div>
													<Button>Open Themes Folder</Button>
													<Button>Edit QuickCss</Button>
												</div>
											</div>
										</section>
									</div>
								</div>
							</div>
						</ScrollArea>
					{:else if currentTab === 2}
						<!-- Torrent Configuration tab content goes here -->
						<ScrollArea class="h-[650px] w-full rounded-md p-4   2xl:h-5/6">
							<TorrentConfiguration />
						</ScrollArea>
					{:else if currentTab === 3}
						<!-- Accounts tab content goes here -->

						<AccountManager />
					{:else if currentTab === 4}
						<!-- Plugins tab content goes here -->
						<ScrollArea class="h-[650px] w-full rounded-md p-4   2xl:h-5/6">
							<Plugins />
						</ScrollArea>
					{:else if currentTab === 5}
						<!-- Developer tab content goes here -->
						<div>Developer Tab Content</div>
					{:else if currentTab === 6}
						<!-- Misc tab content goes here -->
						<div>Misc Tab Content</div>
					{/if}
				</section>
			</div>
		</div>
	</div>
</main>
