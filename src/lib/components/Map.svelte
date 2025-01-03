<script lang="ts">
	import { PUBLIC_MAPTILER_TOKEN } from '$env/static/public';
	import { createEventDispatcher, onMount } from 'svelte';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import maplibre from 'maplibre-gl';
	const { LngLatBounds, Map, Popup } = maplibre;
	import bbox from '@turf/bbox';
	import centroid from '@turf/centroid';
	import type { CityMetadata } from '$lib/@types/esn';
	import type { FeatureCollection } from 'geojson';
	import cityMeta from './../../../data/metadata.json';

	const citiesFile = cityMeta as CityMetadata[];
	export let cities: CityMetadata[] = citiesFile;
	export let statistics: boolean = true;

	let map: maplibre.Map;

	const dispatch = createEventDispatcher();

	// Create a numeric id for each city, save it in an object
	const cityIds = cities.map((city) => city.id);

	// Convert the cities array into GeoJSON
	const geojson: FeatureCollection = {
		type: 'FeatureCollection',
		features: cities.map((city) => ({
			// Use the numeric id as the feature
			id: cityIds.indexOf(city.id),
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [city.geo.center[0], city.geo.center[1]]
			},
			properties: {
				title: city.name
			}
		}))
	};

	// Determine the bounding box and centroid of the GeoJSON
	const bb = bbox(geojson);
	const center: [number, number] = [0, 0];
	let zoom = 7;
	if (cities === citiesFile) {
		// Global map
		center[0] = 0;
		center[1] = 0;
		zoom = 1;
	} else {
		// Country map
		const centerPoint = centroid(geojson);
		center[0] = centerPoint.geometry.coordinates[0];
		center[1] = centerPoint.geometry.coordinates[1];
	}

	// Create function to change the active city
	export function changeActiveCity(city: CityMetadata | null) {
		if (map) {
			if (city !== null) {
				map.setFeatureState(
					{
						source: 'cities',
						id: cityIds.indexOf(city.id)
					},
					{ hover: true }
				);
			} else {
				// Set all features to hover: false, by querying the source and setting all individual features to hover: false
				const features = map.querySourceFeatures('cities');
				features.forEach((feature) => {
					// console.log(feature);
					map.setFeatureState(
						{
							source: 'cities',
							id: feature.id
						},
						{ hover: false }
					);
				});
			}
		} else {
			console.log(`Map not loaded yet`);
		}
	}

	onMount(() => {
		map = new Map({
			container: 'map',
			style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${PUBLIC_MAPTILER_TOKEN}`,
			center,
			zoom
		});

		map.on('load', () => {
			map.addSource('cities', {
				type: 'geojson',
				data: geojson
			});

			map.addLayer({
				id: 'cities',
				type: 'circle',
				source: 'cities',
				paint: {
					'circle-radius': 6,
					// Change color based on featurestate
					'circle-color': [
						'case',
						['boolean', ['feature-state', 'hover'], false],
						'#FF0000',
						'#B42222'
					]
				}
			});

			function fitBounds() {
				if (cities.length > 1) {
					map.fitBounds(new LngLatBounds([bb[0], bb[1]], [bb[2], bb[3]]), {
						padding: 50
					});
				} else {
					map.flyTo({
						center: [cities[0].geo.center[0], cities[0].geo.center[1]],
						zoom: 10
					});
				}
			}

			fitBounds();

			const popup = new Popup({
				closeButton: false,
				closeOnClick: false
			});

			map.on('mouseenter', 'cities', (e) => {
				// Change the cursor style as a UI indicator.
				map.getCanvas().style.cursor = 'pointer';

				if (e.features) {
					// @ts-expect-error - In theory the geometry is always there, since wer're generating it elsewhere
					const coordinates = e.features[0].geometry.coordinates.slice();
					const description = e.features[0].properties.title;

					// Also dispatch an event to the parent component
					dispatch(
						'cityHover',
						cities.find((city) => city.name === description)
					);

					while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
						coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
					}

					popup.setLngLat(coordinates).setHTML(description).addTo(map);
				}
			});

			map.on('mouseleave', 'cities', () => {
				map.getCanvas().style.cursor = '';
				dispatch('cityHover', null);
				popup.remove();
			});

			// Add click event to map
			map.on('click', 'cities', (e) => {
				if (e.features) {
					const description = e.features[0].properties.title;
					const city = cities.find((city) => city.name === description);

					if (city) {
						if (statistics) {
							window.location.href = `/${city.countryId}/${city.id}`;
						} else {
							window.location.href = city.url;
						}
					}
				}
			});

			// Also listen for screen resize events
			window.addEventListener('resize', () => {
				map.resize();
				fitBounds();
			});
		});
	});
</script>

<div id="map"></div>

<style lang="postcss">
	#map {
		@apply w-full min-h-96 h-full;
	}

	:global(.maplibregl-popup-content) {
		@apply p-2 dark:bg-slate-600;
	}

	:global(.maplibre-gl-tip) {
		@apply hidden;
	}
</style>
