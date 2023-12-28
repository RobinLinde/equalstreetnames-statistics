<script lang="ts">
	import type { PageData } from '../$types';
	import type { CompiledCompleteness } from '$lib/@types/esn';
	import CompletenessGraph from '$lib/components/CompletenessGraph.svelte';

	export let data: PageData;

	const compiledCompleteness: CompiledCompleteness = data.completeness;
</script>

<svelte:head>
	<title>EqualStreetnames Statistics - Completeness</title>
</svelte:head>

<div class="graph">
	<CompletenessGraph data={compiledCompleteness} />
</div>

<style lang="postcss">
	.graph {
		@apply w-full h-auto;
	}
</style>
