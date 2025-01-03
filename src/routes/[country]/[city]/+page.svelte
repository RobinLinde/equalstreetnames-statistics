<script lang="ts">
	import type { PageData } from './$types';
	import type { CompiledStatistics } from '$lib/@types/esn';
	import Graph from '$lib/components/Graph.svelte';
	import PieGraph from '$lib/components/PieGraph.svelte';

	let { data }: { data: PageData } = $props();

	//@ts-ignore
	const compiledStats: CompiledStatistics = data.statistics;
</script>

<svelte:head>
	<title>EqualStreetNames Statistics</title>
</svelte:head>

<div class="wrapper">
	<div class="content">
		<div class="graph">
			<Graph data={compiledStats} />
		</div>
		<div class="piegraph">
			<PieGraph data={compiledStats} />
		</div>
	</div>
</div>

<style lang="postcss">
	.wrapper {
		@apply w-full h-auto;
	}
	.content {
		@apply flex flex-col xl:flex-row w-full h-full;
	}

	.graph {
		@apply w-full xl:w-2/3;
	}

	.piegraph {
		@apply min-h-96 w-full xl:w-1/3;
	}
</style>
