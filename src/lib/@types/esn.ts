import type { MultiPolygon } from 'geojson';

/**
 * Format of `cities.json` file
 *
 * Contains a list of countries, each with a list of cities
 */
export interface CityList {
	[country: string]: {
		[city: string]: City;
	};
}

/**
 * Individual city
 */
export interface City {
	/**
	 * Name of the city
	 * @example "🇧🇪 Brussels, Belgium"
	 */
	name: string;

	/**
	 * URL to the web page
	 *
	 * @example "https://equalstreetnames.brussels/"
	 */
	url: string;
}

export interface CityMetadata extends City {
	/**
	 * ID of the city
	 *
	 * @example "brussels"
	 */
	id: string;

	/**
	 * City name, without country
	 *
	 * @example "Brussels"
	 */
	cityName: string;

	/**
	 * ID of the country
	 *
	 * @example "belgium"
	 */
	countryId: string;

	/**
	 * Some geometric information about the city
	 */
	geo: {
		/**
		 * Center point of the city
		 */
		center: [number, number];
	};
}

export interface CompiledStatistics {
	/**
	 * Some generic metadata about the city, as well as the time when the statistics were last updated
	 */
	meta: CityMetadata & {
		/**
		 * Time when the statistics were last updated
		 */
		update: string;
	};

	/**
	 * List of all statistics
	 */
	statistics: HistoryItem[];
}

export interface HistoryItem {
	date: string;
	values: {
		F: number;
		M: number;
		FX: number;
		MX: number;
		X: number;
		NB?: number;
		'+': number;
		'?': number;
		'-': number;
	};
	sources: {
		wikidata: number;
		csv?: number;
		config: number;
		event?: number;
		'-': number;
	} | null;
}
