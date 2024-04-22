<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table/index';
	import type { Writable } from 'svelte/store';
	import { isRealDebridModalVisible, realDebridSettings } from '../../../stores';
	import type { RealDebridSettings } from '../../../types';

	let open: boolean;
	export let isVisible: Writable<boolean>;

	const invoices: {
		name: string;
		action: () => Promise<void>;
		// TODO: fix type
		checkStatus: () => RealDebridSettings | null;
	}[] = [
		{
			name: 'RealDebrid.com',
			action: async () => {
				isRealDebridModalVisible.set(true);
			},
			checkStatus: (): RealDebridSettings | null => {
				return $realDebridSettings;
			}
		},
		{
			name: 'AllDebrid.com',
			action: async () => {},
			checkStatus: () => {
				return null;
			}
		}
	];
</script>

<Dialog.Content>
	<Dialog.Header>
		<Dialog.Title>Choose a Hoster</Dialog.Title>
		<Dialog.Description>Use your premium accounts together with SevenSeas</Dialog.Description>
	</Dialog.Header>
	<Table.Root>
		<Table.Caption>A list of Premium Hosters.</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[100px]">Domain</Table.Head>
				<Table.Head class="w-[100px]">Action</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each invoices as invoice, i (i)}
				<Table.Row class="cursor-pointer">
					<Table.Cell class="font-medium">{invoice.name}</Table.Cell>
					<Table.Cell class="font-medium">
						{#if invoice.checkStatus()}
							Connected
						{:else}
							<button class="m-0 p-0 text-sm text-primary hover:underline" on:click={invoice.action}
								>Connect</button
							>
						{/if}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</Dialog.Content>
