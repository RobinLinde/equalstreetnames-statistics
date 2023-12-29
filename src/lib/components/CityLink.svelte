<script lang="ts">
	import type { CityMetadata } from '$lib/@types/esn';
	import { createEventDispatcher } from 'svelte';

	export let city: CityMetadata;
	export let statistics: boolean = false;
	export let active: boolean = false;

	const dispatcher = createEventDispatcher();

	function handleMouseEnter() {
		dispatcher('cityHover', city);
	}

	function handleMouseLeave() {
		dispatcher('cityHover', null);
	}
</script>

<li class="city">
	{#if statistics}
		<span
			><a
				href={`/${city.countryId}/${city.id}`}
				class={active ? 'active' : ''}
				on:mouseenter={handleMouseEnter}
				on:mouseleave={handleMouseLeave}>{city.cityName}</a
			></span
		>
		<span><a href={city.url}>🔗</a></span>
	{:else}
		<span
			><a
				href={city.url}
				class={active ? 'active' : ''}
				on:mouseenter={handleMouseEnter}
				on:mouseleave={handleMouseLeave}>{city.cityName}</a
			></span
		>
	{/if}
</li>

<style lang="postcss">
	li.city {
		@apply border-b border-orange-800 flex flex-row justify-between;

		&:first-child {
			@apply border-t;
		}

		&:last-child {
			@apply border-b-0 rounded-b-lg;
		}

		span {
			@apply flex flex-row;

			a {
				@apply text-black dark:text-white hover:text-white no-underline inline-block w-full p-2 lg:py-0;

				&:hover,
				&.active {
					@apply bg-orange-800 text-white;
				}
			}

			&:first-child {
				@apply flex-grow;
			}
		}
	}
</style>
