<script>
	import CityList from '$lib/components/CityList.svelte';
	import Counter from '$lib/components/Counter.svelte';
</script>

<svelte:head>
	<title>EqualStreetNames</title>
</svelte:head>

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

<CityList />
