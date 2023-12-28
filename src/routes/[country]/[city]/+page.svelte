<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';
	import type { CompiledStatistics } from '$lib/@types/esn';
	import Graph from '$lib/components/Graph.svelte';
	import PieGraph from '$lib/components/PieGraph.svelte';

	export let data: PageData;

	const compiledStats: CompiledStatistics = data.statistics;
</script>

<div class="content">
	<div class="graph">
		<Graph data={compiledStats} />
	</div>
	<div class="piegraph">
		<PieGraph data={compiledStats} />
	</div>
</div>

<style lang="postcss">
	.content {
		@apply flex flex-row;
	}

	.graph {
		@apply w-full h-auto;
	}

	.piegraph {
		@apply w-full h-auto;
	}
</style>
