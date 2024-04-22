<script lang="ts">
	import type { IGDBImageSize } from '$lib';

	export let imageSize: IGDBImageSize = 'original';
	export let imageId: string | null;
	export let alt: string | null | undefined;

	let src: string;
	$: src = `https://images.igdb.com/igdb/image/upload/t_${imageSize}/${imageId}.png`;
	$: alt = alt;
	$: imageSize = imageSize;
</script>

<img {src} {alt} {...$$restProps} />
