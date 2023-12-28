<script lang="ts">
	export let page: string;
	export let name: string;
</script>

<li>
	<a href={page}>{name}</a>
</li>

<style lang="postcss">
	li {
		@apply float-left text-orange-400 text-2xl underline cursor-pointer  m-2;

		&:hover {
			@apply text-orange-800 no-underline;
		}
	}

	a:focus {
		@apply outline-dashed outline-2 outline-orange-400 rounded-md;
	}
</style>
