<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';
	import type { CompiledCompleteness } from '$lib/@types/esn';
	import CompletenessGraph from '$lib/components/CompletenessGraph.svelte';

	export let data: PageData;

	const compiledCompleteness: CompiledCompleteness = data.completeness;

	// Log data onMount
	onMount(() => {
		console.log(data);
	});
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
