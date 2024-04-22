<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';

	export let duration = 45;

	const dispatch = createEventDispatcher();
	let progress = tweened(100);

	let remaining = duration;
	let color = '#4285F4';

	const updateRemaining = () => {
		const percentage = $progress;
		remaining = Math.ceil((duration * percentage) / 100);
		if (percentage <= 20) {
			color = '#FF0000';
		} else if (percentage <= 50) {
			color = '#FFA500';
		} else {
			color = '#4285F4';
		}
	};

	export const startCountdown = async () => {
		progress.subscribe(updateRemaining);
		await progress.set(0, { duration: duration * 1000 });
	};

	export const stopCountdown = async () => await progress.set(100);

	export const resetCountdown = () => (remaining = duration);

	onMount(() => {
		dispatch('mounted');
	});
</script>

<div class="absolute right-2 top-2">
	<svg class="progress-bar" viewBox="0 0 36 36">
		<g style="transform: rotate(-90deg) translate(-36px, 0);">
			<path
				class="bg-circle"
				d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
			/>
			<path
				class="progress-circle"
				d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
				style="stroke-dasharray: {100 - $progress}, 100; stroke: {color}"
			/>
		</g>
		<text x="18" y="19" class="svg-text" text-anchor="middle" dominant-baseline="middle"
			>{remaining}s</text
		>
	</svg>
</div>

<style>
	.progress-bar {
		width: 70px;
		height: 70px;
	}

	.bg-circle,
	.progress-circle {
		fill: none;
		stroke-width: 2.5;
	}

	.bg-circle {
		stroke: #161e30;
	}

	.progress-circle {
		stroke-linecap: round;
		transition:
			stroke-dasharray 0.3s linear,
			stroke 0.3s linear;
	}

	.svg-text {
		fill: #0d968b;
		font-size: 0.65em;
		font-family: Arial, sans-serif;
	}
</style>
