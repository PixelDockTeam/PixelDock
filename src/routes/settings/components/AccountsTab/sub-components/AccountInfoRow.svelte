<script>
	import { PencilLine, RefreshCcw, Trash2 } from 'lucide-svelte';

	export let name = '';
	export let type = '';
	export let date = '';
	export let service = '';

	const handleEdit = () => {
		/* implement the edit logic here */
	};
</script>

<tr>
	<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-400 sm:pl-6">{name}</td>
	<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{type}</td>
	<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{date}</td>
	<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{service}</td>
	<td
		class="relative flex gap-3 whitespace-nowrap px-3 py-4 text-right text-sm font-medium sm:pr-12"
	>
		<button class="" on:click={handleEdit}>
			<RefreshCcw class="h-5 w-5 text-primary hover:text-primary/90 hover:underline" />
		</button>
		<button class="" on:click={handleEdit}>
			<PencilLine class="h-5 w-5 text-primary hover:text-primary/90 hover:underline" />
		</button>
		<button class="" on:click={handleEdit}>
			<Trash2 class="h-5 w-5 text-primary hover:text-primary/90 hover:underline" />
		</button>
	</td>
</tr>
