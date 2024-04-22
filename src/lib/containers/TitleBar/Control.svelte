<script lang="ts">
	// your script goes here
	interface $$Props {
		class: string;
	}
</script>

<button tabindex="-1" class="titlebar-button group cursor-pointer" on:click id="titlebar-maximize">
	<svg width="30" height="30" {...$$props}>
		<circle cx="15" cy="15" r="6" />
	</svg>
</button>
