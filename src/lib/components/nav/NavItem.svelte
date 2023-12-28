<script lang="ts">
	import { goto } from '$app/navigation';

	export let page: string;
	export let name: string;

	const href = `/${page}`;
	const isExternal = page.startsWith('http');
</script>

<li>
	<span
		on:click={() => {
			if (isExternal) {
				window.open(page, '_blank');
			} else {
				goto(href);
			}
		}}
		on:keypress={(e) => {
			if (e.key === 'Enter') {
				if (isExternal) {
					window.open(page, '_blank');
				} else {
					goto(href);
				}
			}
		}}
		role="button"
		tabindex="0">{name}</span
	>
</li>

<style lang="postcss">
	li {
		@apply float-left text-orange-400 text-2xl underline cursor-pointer  m-2;

		&:hover {
			@apply text-orange-800 no-underline;
		}
	}

	span:focus {
		@apply outline-dashed outline-2 outline-orange-400 rounded-md;
	}
</style>
