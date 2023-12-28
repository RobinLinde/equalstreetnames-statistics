import type { PageLoad } from './$types';
import cities from './../../../data/metadata.json';
import type { CityMetadata } from '$lib/@types/esn';

const cityMeta = cities as CityMetadata[];

export function load({ params }: PageLoad) {
	const cities = cityMeta.filter((city) => {
		return city.countryId === params.country;
	});
	return { cities };
}
