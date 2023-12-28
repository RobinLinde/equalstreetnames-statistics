<script lang="ts">
	import type { CityList } from '$lib/@types/esn';
	import cities from '@equalstreetnames/global/cities.json';
	import CityLink from './CityLink.svelte';

	export let citiesfile: CityList = cities;
	export let statistics: boolean = true;
	const countries = Object.keys(citiesfile).map((country) => {
		return {
			country: country,
			cities: Object.keys(citiesfile[country]).map((city) => {
				return {
					country: country,
					city: city,
					name: citiesfile[country][city].name,
					strippedName: citiesfile[country][city].name.split(',')[0].substring(5),
					url: citiesfile[country][city].url
				};
			}),
			emoji: citiesfile[country][Object.keys(citiesfile[country])[0]].name.substring(0, 4)
		};
	});
</script>

<span class="list">
	{#each countries as country}
		<span class="country">
			<span class="country-name"><h2>{country.emoji}</h2></span>

			<ul>
				{#each country.cities as city}
					<CityLink {city} {statistics} />
				{/each}
			</ul>
		</span>
	{/each}
</span>

<style lang="postcss">
	.list {
		@apply flex flex-row flex-wrap;
	}

	.country {
		@apply flex flex-col m-4 pt-2 border border-orange-800 rounded-lg h-min dark:bg-slate-600;
	}

	.country-name {
		@apply flex justify-center pb-2;
	}

	h2 {
		@apply text-xl w-max;
	}
</style>
