<script lang="ts">
	import type { CityMetadata } from '$lib/@types/esn';
	import CityList from '$lib/components/CityList.svelte';
	import Counter from '$lib/components/Counter.svelte';
	import Map from '$lib/components/Map.svelte';

	let activeCity: CityMetadata | null = null;
	let map: Map;
</script>

<svelte:head>
	<title>EqualStreetNames Statistics</title>
</svelte:head>

<div>
	<Counter />

	<p>
		The names of public spaces (streets, avenues, squares and others) define the identity of a city
		and how citizens interact with it. Most cities suffer from a major inequality between male and
		female street names and we want to help fix this.
	</p>
	<p>
		For more information visit the
		<a href="https://github.com/EqualStreetNames/equalstreetnames">GitHub repository</a>
	</p>
	<p>
		After clicking on one of the cities below you can view some statistics about the data
		completeness over time. For comparison, there also is a graph showing the completeness of all
		cities in one view.
	</p>

	<div class="content">
		<div class="list">
			<CityList
				{activeCity}
				on:cityHover={(e) => {
					activeCity = e.detail;
					map.changeActiveCity(e.detail);
				}}
			/>
		</div>
		<div class="map">
			<Map
				on:cityHover={(e) => {
					activeCity = e.detail;
				}}
				bind:this={map}
			/>
		</div>
	</div>
</div>

<style lang="postcss">
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
