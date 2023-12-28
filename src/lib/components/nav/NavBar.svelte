<script>
	import NavItem from './NavItem.svelte';
</script>

<nav>
	<ul>
		<NavItem page="/" name="Overview" />
		<NavItem page="/completeness" name="Completeness" />
	</ul>
</nav>

<style lang="postcss">
	ul {
		@apply list-none;
	}
</style>
