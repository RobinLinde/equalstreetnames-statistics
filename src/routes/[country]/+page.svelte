<script lang="ts">
	import type { PageData } from '../$types';
	import CityList from '$lib/components/CityList.svelte';
	import type { CityMetadata } from '$lib/@types/esn';

	export let data: PageData;

	const cities = data.cities as CityMetadata[];
</script>

{#if cities.length > 0}
	<CityList citiesfile={cities} />
{:else}
	<p>Country not found</p>
{/if}
