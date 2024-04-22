<script lang="ts">
	// Importing a custom type for use with the `times` prop.
	import { type TupMinMax } from '$lib/@types';

	// `times` prop accepts an array of numbers with a length between 1 and 3.
	export let times: TupMinMax<number, 1, 3>;

	// Calculate the total time by summing up all elements in the `times` array.
	const total = times.reduce((acc, time) => acc! + time!, 0);

	// Calculate the percentage of each time relative to the total,
	// and format it to two decimal places.
	const percentages = times.map((time) => ((time! / total!) * 100).toFixed(2));

	// The list of bg colours the items will have in numerical order
	const percentageColors = [`bg-cyan-500/80`, `bg-blue-500/80`, `bg-primary/80`];
</script>

<!-- Main container -->
<div class="w-full overflow-hidden rounded-sm">
	<!-- Flex container for the percentage bars. -->
	<div class="flex flex-row">
		{#each percentages as percentage, index}
			<!--Inline style to dynamically set the width of each div based on its percentage.   -->

			<div
				style={`width: ${percentage}%;`}
				class={`${percentageColors[index]} flex flex-row items-center justify-center p-2 text-white`}
			>
				<!-- Display the time in hours inside each div. -->
				<span class="text-lg font-bold text-white">
					{times[index]} hours
				</span>
			</div>
		{/each}
	</div>
</div>
