<script lang="ts">
	import type { PageData } from '../$types';
	import type { CompiledStatistics } from '$lib/@types/esn';
	import Graph from '$lib/components/Graph.svelte';
	import PieGraph from '$lib/components/PieGraph.svelte';

	export let data: PageData;

	const compiledStats: CompiledStatistics = data.statistics;
</script>

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
		@apply flex flex-row w-full h-full;
	}

	.graph {
		@apply w-1/2 h-full;
	}

	.piegraph {
		@apply w-1/2 h-1/2;
	}
</style>
