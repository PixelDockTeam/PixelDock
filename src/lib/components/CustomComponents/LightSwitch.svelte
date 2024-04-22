<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import { toggleMode } from 'mode-watcher';
	import { MoonStar, Sun } from 'lucide-svelte';
</script>

<Button on:click={toggleMode} class=" group " variant="ghost" size="icon">
	<Sun
		class="h-[1.2rem] w-[1.2rem] group-hover:stroke-slate-400 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

	<MoonStar
		class="absolute h-[1.2rem] group-hover:stroke-slate-400  w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

	<span class="sr-only">Toggle theme</span>
</Button>