<script lang="ts">
	import type { CityList } from '$lib/@types/esn';
	import cities from '@equalstreetnames/global/cities.json';

	const citiesfile: CityList = cities;

	const countryCount = Object.keys(citiesfile).length;
	const cityCount = Object.keys(citiesfile).reduce((acc, country) => {
		return acc + Object.keys(citiesfile[country]).length;
	}, 0);
</script>

<h1>{cityCount} cities in {countryCount} countries across the world.</h1>

<style>
	h1 {
		@apply text-4xl font-bold pb-2;
	}
</style>
