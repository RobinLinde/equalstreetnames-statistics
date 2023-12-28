<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import '../app.css';
</script>

<svelte:head>
	<meta
		name="description"
		content="The names of public spaces (streets, avenues, squares and others) define the identity of a city and how citizens interact with it. Most cities suffer from a major inequality between male and female street names and we want to help fix this."
	/>
</svelte:head>

<div>
	<header>
		<Header />
	</header>

	<main>
		<slot />
	</main>

	<footer>
		<Footer />
	</footer>
</div>

<style lang="postcss">
	div {
		@apply flex flex-col min-h-screen;
	}

	main {
		@apply p-16 text-lg lg:px-32 xl:px-64 flex-grow;
		@apply bg-gray-100 dark:bg-slate-900 dark:text-white;
	}

	footer {
		@apply bottom-0 w-full;
	}
</style>
