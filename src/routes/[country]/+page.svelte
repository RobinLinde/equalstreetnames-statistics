<script lang="ts">
	import type { PageData } from '../$types';
	import CityList from '$lib/components/CityList.svelte';
	import type { CityMetadata } from '$lib/@types/esn';
	import Map from '$lib/components/Map.svelte';

	export let data: PageData;

	const cities = data.cities as CityMetadata[];

	let activeCity: CityMetadata | null = null;
	let map: Map;
</script>

<svelte:head>
	<title>EqualStreetNames Statistics</title>
</svelte:head>

{#if cities.length > 0}
	<div class="content">
		<div class="list">
			<CityList
				citiesfile={cities}
				{activeCity}
				on:cityHover={(e) => {
					activeCity = e.detail;
					map.changeActiveCity(e.detail);
				}}
			/>
		</div>
		<div class="map">
			<Map
				{cities}
				on:cityHover={(e) => {
					activeCity = e.detail;
				}}
				bind:this={map}
			/>
		</div>
	</div>
{:else}
	<p>Country not found</p>
{/if}

<style lang="postcss">
	.content {
		@apply flex flex-row flex-1;
	}

	.map {
		@apply flex-1;
	}
</style>
