<script>
	import NavItem from './NavItem.svelte';
</script>

<nav>
	<ul>
		<NavItem page="/" name="Go back" />
	</ul>
</nav>

<style lang="postcss">
	ul {
		@apply list-none;
	}
</style>
