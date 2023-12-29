<script lang="ts">
	import type { CityMetadata } from '$lib/@types/esn';
	import { createEventDispatcher } from 'svelte';
	import cityMeta from './../../../data/metadata.json';
	import CityLink from './CityLink.svelte';

	const cities = cityMeta as CityMetadata[];

	export let citiesfile: CityMetadata[] = cities;
	export let statistics: boolean = true;
	export let activeCity: CityMetadata | null = null;

	const dispatcher = createEventDispatcher();

	const countries = citiesfile
		.map((city) => {
			return city.countryId;
		})
		.filter((value, index, self) => self.indexOf(value) === index)
		.map((country) => {
			return {
				country,
				cities: citiesfile.filter((city) => {
					return city.countryId === country;
				}),
				emoji: citiesfile
					.find((city) => {
						return city.countryId === country;
					})
					?.name.substring(0, 4)
			};
		});
</script>

<span class="list">
	{#each countries as country}
		<span class="country">
			<span class="country-name"
				><h2>
					{#if statistics}
						<a href={`/${country.country}`}>{country.emoji}</a>
					{:else}
						{country.emoji}
					{/if}
				</h2></span
			>

			<ul>
				{#each country.cities as city}
					<CityLink
						{city}
						{statistics}
						active={city === activeCity}
						on:cityHover={(e) => {
							dispatcher('cityHover', e.detail);
						}}
					/>
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
