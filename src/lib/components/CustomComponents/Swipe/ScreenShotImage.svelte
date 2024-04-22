<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let className: HTMLAttributes<HTMLImageElement>['class'] = undefined;

	export let src: any;
	export let alt: string | null | undefined;

	export { className as class };
</script>

<div class="aspect-video h-[5.5rem]">
	<img
		{src}
		{alt}
		class={cn('h-full w-full rounded-lg object-cover', className)}
		{...$$restProps}
	/>
</div>
