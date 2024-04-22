<script lang="ts">
	export let notificationData: {
		title: string;
		description: string;
		date: string;
		notificationId: string;
		icon?: string;
		href?: string;
	};
</script>

<a
	href={notificationData.href}
	class="block min-w-full cursor-pointer rounded-md p-2 hover:bg-muted"
>
	<div class="flex w-full flex-row place-content-between justify-between">
		<div class="flex max-w-[70%] text-sm">{notificationData.description}</div>
		<div class="flex min-w-0 flex-col">
			<p class="text-xs text-muted-foreground">{notificationData.date}</p>
		</div>
	</div>
</a>
