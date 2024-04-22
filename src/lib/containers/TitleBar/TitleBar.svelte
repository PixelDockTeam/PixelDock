<script>
	import { appWindow } from '@tauri-apps/api/window';
	import Control from './Control.svelte';
</script>

<div
	tabindex="-1"
	data-tauri-drag-region
	class="titlebar relative flex h-8 items-center justify-between bg-background"
>
	<div class="titlebar-appname pointer-events-none mx-auto w-fit text-center font-black">
		PixelDock
	</div>
	<div tabindex="-1" class="controls absolute right-0 flex items-center">
		<Control on:click={appWindow.minimize} class="fill-yellow-400 group-hover:fill-yellow-400/70" />
		<Control
			on:click={appWindow.toggleMaximize}
			class="fill-green-400 group-hover:fill-green-400/70"
		/>
		<Control on:click={appWindow.close} class="fill-red-400 group-hover:fill-red-400/70" />
	</div>
</div>

<style>
	.titlebar {
		user-select: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
	}
</style>
