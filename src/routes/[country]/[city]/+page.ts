import type { PageLoad } from './$types';

export function load({ params }: PageLoad) {
	// Import the correct statistics file
	const statistics = import(`../../../../data/${params.country}/${params.city}.json`);

	// Return the data
	return {
		statistics
	};
}
