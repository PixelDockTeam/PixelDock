<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Search } from 'lucide-svelte';
</script>

<nav class="flex  items-center justify-between bg-white bg-opacity-15 px-6 py-4 text-black">
	<div class="flex items-center">
		<span class="mr-2 text-xl font-bold ">SS</span>
	</div>
	<div class="flex items-center">
		<Input
			placeholder="Search..."
			class="rounded-none rounded-bl-md rounded-tl-md hover:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
		/>
		<Button
			class="-ml-1 w-14 rounded-none rounded-br-md rounded-tr-md bg-white text-black"
			size="icon"
			variant="secondary"
		>
			<Search />
		</Button>
	</div>
</nav>
