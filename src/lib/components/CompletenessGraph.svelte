<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import type { CompiledCompleteness } from '$lib/@types/esn';

	export let data: CompiledCompleteness;

	// Process graph data
	const graphData = data.cities.map((city) => {
		return {
			name: city.city.name,
			mapped: city.mappedPercentage
		};
	});

	onMount(() => {
		console.log(graphData);
		const ctx = document.getElementById('piegraph') as HTMLCanvasElement;
		new Chart(ctx, {
			type: 'bar',
			data: {
				datasets: [
					{
						label: 'Completeness',
						data: graphData
					}
				]
			},
			options: {
				parsing: {
					xAxisKey: 'name',
					yAxisKey: 'mapped'
				},
				plugins: {
					tooltip: {
						callbacks: {
							label: function (tooltipItem) {
								return '' + tooltipItem.parsed.y.toFixed(1) + '% completed';
							}
						}
					}
				}
			}
		});
	});
</script>

<div>
	<canvas id="piegraph"></canvas>
</div>

<style lang="postcss">
	div,
	.piegraph {
		@apply w-full h-full;
	}
</style>
