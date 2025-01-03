import type { PageLoad } from './$types';

export async function load({ params }: PageLoad) {
	// Import the correct statistics file
	const statistics = await import(`../../../../data/${params.country}/${params.city}.json`);

	// Return the data
	return {
		statistics
	};
}
