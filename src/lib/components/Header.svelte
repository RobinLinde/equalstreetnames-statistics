<script lang="ts">
	import NavBar from './nav/NavBar.svelte';
</script>

<section>
	<span class="left">
		<a href="/">
			<h1>EqualStreetNames Statistics</h1>
		</a>
	</span>
	<!-- <span class="right">
		<NavBar />
	</span> -->
</section>

<style lang="postcss">
	section {
		@apply bg-gray-800 text-white border-b-4 border-orange-400 flex flex-row justify-between items-center p-4 flex-wrap;
	}
	span {
		@apply flex flex-row justify-between items-center;
	}
	h1 {
		@apply text-2xl font-bold;
	}
</style>
