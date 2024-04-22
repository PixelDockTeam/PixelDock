<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index';
	import * as Popover from '$lib/components/ui/popover/index';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	const themes = [
		{
			value: 'dark',
			label: 'Dark Mode'
		},
		{
			value: 'light',
			label: 'Light Mode'
		},
		{
			value: 'solarized',
			label: 'Solarized'
		},
		{
			value: 'high-contrast',
			label: 'High Contrast'
		},
		{
			value: 'ocean',
			label: 'Ocean'
		}
	];

	let open = false;
	let value = '';

	$: selectedTheme =
		themes.find((t) => t.value === value)?.label ?? 'Select a Theme...';

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-[325px] bg-background/30 justify-between"
		>
			{selectedTheme}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[325px] p-0 ">
		<Command.Root class="bg-input">
			<Command.Input class="focus:outline-none focus:ring-primary focus:border-primary"
										 placeholder="Search framework..." />
			<Command.Empty>No framework found.</Command.Empty>
			<Command.Group class="bg-secondary">
				{#each themes as theme}
					<Command.Item
						class="hover:bg-red-500 cursor-pointer hover:border-primary border-2 hover:text-red-500"
						value={theme.value}
						onSelect={(currentValue) => {
              value = currentValue;
              closeAndFocusTrigger(ids.trigger);
            }}
					>
						<Check
							class={cn(
                "mr-2 h-4 w-4",
                value !== theme.value && "text-transparent"
              )}
						/>
						{theme.label}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>