<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-date-fns';
	import type { CompiledStatistics } from '$lib/@types/esn';

	export let data: CompiledStatistics;

	// Convert data to format that Chart.js understands
	const graphData = data.statistics.map((item) => {
		return {
			x: item.date,
			F: item.values.F,
			M: item.values.M,
			FX: item.values.FX,
			MX: item.values.MX,
			X: item.values.X,
			NB: item.values.NB,
			'+': item.values['+'],
			'?': item.values['?'],
			'-': item.values['-'],
			wikidata: item.sources?.wikidata,
			config: item.sources?.config,
			csv: item.sources?.csv,
			event: item.sources?.event,
			nm: item.sources?.['-']
		};
	});

	onMount(() => {
		const ctx = document.getElementById('graph') as HTMLCanvasElement;
		new Chart(ctx, {
			type: 'line',
			data: {
				datasets: [
					{
						label: 'Female (cis)',
						data: graphData,
						backgroundColor: '#800080',
						borderColor: '#800080',
						parsing: {
							yAxisKey: 'F'
						}
					},
					{
						label: 'Male (cis)',
						data: graphData,
						backgroundColor: '#C8C800',
						borderColor: '#C8C800',
						parsing: {
							yAxisKey: 'M'
						}
					},
					{
						label: 'Female (trans)',
						data: graphData,
						backgroundColor: '#00A050',
						borderColor: '#00A050',
						parsing: {
							yAxisKey: 'FX'
						}
					},
					{
						label: 'Male (trans)',
						data: graphData,
						backgroundColor: '#00A050',
						borderColor: '#00A050',
						parsing: {
							yAxisKey: 'MX'
						}
					},
					{
						label: 'Intersex',
						data: graphData,
						backgroundColor: '#00A050',
						borderColor: '#00A050',
						parsing: {
							yAxisKey: 'X'
						}
					},
					{
						label: 'Non-binary',
						data: graphData,
						backgroundColor: '#808080',
						borderColor: '#808080',
						parsing: {
							yAxisKey: 'NB'
						}
					},
					{
						label: 'Multiple',
						data: graphData,
						backgroundColor: '#A46440',
						borderColor: '#A46440',
						parsing: {
							yAxisKey: '+'
						}
					},
					{
						label: 'Unknown',
						data: graphData,
						backgroundColor: '#808080',
						borderColor: '#808080',
						parsing: {
							yAxisKey: '?'
						}
					},
					{
						label: 'Not a person',
						data: graphData,
						backgroundColor: '#DDDDDD',
						borderColor: '#DDDDDD',
						parsing: {
							yAxisKey: '-'
						}
					},
					{
						label: 'Wikidata',
						data: graphData,
						borderDash: [5, 5],
						backgroundColor: '#990000',
						borderColor: '#990000',
						parsing: {
							yAxisKey: 'wikidata'
						}
					},
					{
						label: 'From config file',
						data: graphData,
						borderDash: [5, 5],
						backgroundColor: '#1000FF',
						borderColor: '#1000FF',
						parsing: {
							yAxisKey: 'config'
						}
					},
					{
						label: 'CSV',
						data: graphData,
						borderDash: [5, 5],
						backgroundColor: '#1000FF',
						borderColor: '#1000FF',
						parsing: {
							yAxisKey: 'csv'
						}
					},
					{
						label: 'Event',
						data: graphData,
						borderDash: [5, 5],
						backgroundColor: '#00A1FF',
						borderColor: '#00A1FF',
						parsing: {
							yAxisKey: 'event'
						}
					},
					{
						label: 'Not mapped',
						data: graphData,
						borderDash: [5, 5],
						backgroundColor: '#DDDDDD',
						borderColor: '#DDDDDD',
						parsing: {
							yAxisKey: 'nm'
						}
					}
				]
			},
			options: {
				// responsive: true,
				scales: {
					x: {
						type: 'time'
					},
					y: {
						beginAtZero: true
					}
				}
			}
		});
	});
</script>

<div>
	<canvas id="graph"></canvas>
</div>

<style lang="postcss">
	div,
	.graph {
		@apply w-full h-full;
	}
</style>
