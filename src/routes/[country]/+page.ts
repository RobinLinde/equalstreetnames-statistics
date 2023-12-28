import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import cities from '@equalstreetnames/global/cities.json';

export function load({ params }: PageLoad) {
	const output = {
		[params.country]: cities[params.country]
	};

	if (!output[params.country]) {
		error(404, 'Country not found');
	}
	return output;
}
