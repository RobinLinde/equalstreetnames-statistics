<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';
	import CityList from '$lib/components/CityList.svelte';

	export let data: PageData;

	// Log data onMount
	onMount(() => {
		console.log(data);
	});
</script>

{#if data[Object.keys(data)[0]]}
	<CityList citiesfile={data} />
{:else}
	<p>Country not found</p>
{/if}
