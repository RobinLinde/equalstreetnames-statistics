<script>
	import CityList from '$lib/components/CityList.svelte';
	import Counter from '$lib/components/Counter.svelte';
</script>

<svelte:head>
	<title>EqualStreetNames Statistics</title>
</svelte:head>

<div>
	<Counter />

	<p>
		The names of public spaces (streets, avenues, squares and others) define the identity of a city
		and how citizens interact with it. Most cities suffer from a major inequality between male and
		female street names and we want to help fix this.
	</p>
	<p>
		For more information visit the
		<a href="https://github.com/EqualStreetNames/equalstreetnames">GitHub repository</a>
	</p>
	<p>
		After clicking on one of the cities below you can view some statistics about the data
		completeness over time. For comparison, there also is a graph showing the completeness of all
		cities in one view.
	</p>

	<CityList />
</div>
