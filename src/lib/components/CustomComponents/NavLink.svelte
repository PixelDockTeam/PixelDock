<script lang="ts">
	export let link: { title: string; url: string };
	export let currentRoute: string;
	$: href = link.url;
	$: title = link.title;
</script>

<a
	tabindex="0"
	class={`inline-flex items-center text-sm font-medium text-foreground ${(link.url.length <= 1 ? '/' : link.url.toLowerCase()?.split('/')[1]) === currentRoute ? 'border-b-2 border-primary px-1 pt-1 text-muted-foreground' : ''}`}
	href={link.url}
>
	{title}
</a>
