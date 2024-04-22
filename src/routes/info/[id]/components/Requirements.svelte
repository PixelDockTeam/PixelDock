<script lang="ts">
	export let title: string = '';

	export let requirements: {
		os?: string;
		processor?: string;
		memory?: string;
		graphics?: string;
		storage?: string;
		network?: string;
	};

	const { graphics, memory, os, processor, storage, network } = requirements;
</script>

<ul
	class="divide-gray-200 rounded-lg border-gray-200 bg-white py-4 dark:divide-gray-700 dark:border-gray-700 dark:bg-secondary dark:text-gray-100"
>
	<h3 class="p-4 py-1 text-lg font-bold leading-6 text-primary">{title}</h3>
	<li class="flex flex-col justify-between gap-1 p-4 py-1">
		<span class="text-xs font-medium text-slate-400">System</span>
		<span class="mr-1 text-sm">{os}</span>
	</li>
	<li class="flex flex-col justify-between gap-1 p-4 py-1">
		<span class="text-xs font-medium text-slate-400">Proccessor</span>
		<span class="mr-1 text-sm">{processor}</span>
	</li>
	<li class="flex flex-col justify-between gap-1 p-4 py-1">
		<span class="text-xs font-medium text-slate-400">Memory</span>
		<span class="mr-1 text-sm">{memory}</span>
	</li>
	<li class="flex flex-col justify-between gap-1 p-4 py-1">
		<span class="text-xs font-medium text-slate-400">Storage</span>
		<span class="mr-1 text-sm">{storage}</span>
	</li>
</ul>
