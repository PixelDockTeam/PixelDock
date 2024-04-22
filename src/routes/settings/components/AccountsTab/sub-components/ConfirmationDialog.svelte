<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	export let open: boolean;
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	let checked = false;
</script>
<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				Are you Sure? You are trying to disable all premium accounts.
				if you continue, PixelDock will <span class="font-semibold text-destructive">NOT</span> use your premium
				accounts unless you re enable this feature.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<div class="flex items-center space-x-2">
				<Label
					id="terms-label"
					for="terms"
					class="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Don't show this again
				</Label>
				<Checkbox id="terms" bind:checked aria-labelledby="terms-label" />

			</div>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>