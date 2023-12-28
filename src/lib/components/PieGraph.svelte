<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import type { CompiledStatistics } from '$lib/@types/esn';

	export let data: CompiledStatistics;

	// Process graph data, we only need the last value
	const historyItem = data.statistics[data.statistics.length - 1];
	const unmapped = historyItem.sources?.['-'] ?? 0;
	let mapped = historyItem.sources?.wikidata ?? 0;
	if (historyItem.sources?.config) {
		mapped += historyItem.sources?.config;
	}
	if (historyItem.sources?.csv) {
		mapped += historyItem.sources?.csv;
	}
	if (historyItem.sources?.event) {
		mapped += historyItem.sources?.event;
	}
	const total = mapped + unmapped;

	onMount(() => {
		const ctx = document.getElementById('piegraph') as HTMLCanvasElement;
		new Chart(ctx, {
			type: 'pie',
			data: {
				labels: ['Etymology known', 'Etymology unknown'],
				datasets: [
					{
						data: [(mapped / total) * 100, (unmapped / total) * 100],
						backgroundColor: ['green', 'red']
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom'
					},
					tooltip: {
						callbacks: {
							label: function (tooltipItem) {
								return tooltipItem.label + ' (' + tooltipItem.parsed.toFixed(1) + '%)';
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
