<script>
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { Bell } from 'lucide-svelte';
	import Notification from './Notification.svelte';

	// your script goes here
</script>

<Popover.Root portal={null}>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="ghost"
			builders={[builder]}
			type="button"
			class="relative rounded-full p-2 text-foreground hover:bg-muted hover:text-slate-400 focus:outline-none"
		>
			<span
				class="absolute right-[11px] top-[8px] h-[8px] w-[8px] overflow-hidden rounded-full bg-green-200 ring-2 ring-secondary/70"
			/>
			<Bell />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-80">
		<div class="grid gap-3">
			<div>
				<div class="flex items-center justify-between">
					<h3 class="text-sm font-medium">Notifications</h3>
					<a href="/notifications" class="text-xs font-medium text-foreground">See all</a>
				</div>
				<div class="mt-3 space-y-3">
					<div class="flex flex-col items-center justify-start gap-3">
						<Notification
							notificationData={{
								title: 'God of war: is now avalible to download',
								description: 'God of war: is now avalible to download',
								date: '2 days ago',
								notificationId: '1',
								href: `/notification/${1}`
							}}
						/>

						<Notification
							notificationData={{
								title: 'Your account has been created',
								description: 'Your account has been created',
								date: '3 days ago',
								notificationId: '2',
								href: `/notification/${2}`
							}}
						/>

						<Notification
							notificationData={{
								title: 'God of war: has finshed downloading',
								description: 'God of war: has finshed downloading',
								date: '4+ days ago',
								notificationId: '3',
								href: `/notification/${3}`
							}}
						/>
					</div>
				</div>
			</div>
		</div></Popover.Content
	>
</Popover.Root>
