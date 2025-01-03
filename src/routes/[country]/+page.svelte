<script lang="ts">
	import type { PageData } from '../$types';
	import CityList from '$lib/components/CityList.svelte';
	import type { CityMetadata } from '$lib/@types/esn';
	import Map from '$lib/components/Map.svelte';

	let { data }: { data: PageData } = $props();

	const cities = data.cities as CityMetadata[];

	let activeCity: CityMetadata | null = $state(null);
	let map: Map | null = $state(null);
</script>

<svelte:head>
	<title>EqualStreetNames Statistics</title>
</svelte:head>

<div class="wrapper">
	{#if cities.length > 0}
		<div class="content">
			<div class="list">
				<CityList
					citiesfile={cities}
					{activeCity}
					on:cityHover={(e) => {
						activeCity = e.detail;
						if (map) {
							map.changeActiveCity(e.detail);
						}
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
</div>

<style lang="postcss">
	.wrapper {
		@apply w-full h-auto;
	}
	.content {
		@apply flex flex-col xl:flex-row;
	}

	.list {
		@apply w-full xl:w-1/3;
	}

	.map {
		@apply min-h-96 w-full xl:w-2/3;
	}
</style>
