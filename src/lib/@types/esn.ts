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

/**
 * Extended metadata about a city,
 * such as its ID, country, and geographic information
 */
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

/**
 * Compiled statistics for a city,
 * contains metadata about the city, as well as the statistics themselves
 */
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

/**
 * History item, showing statistics for a given date
 */
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

/**
 * Compiled list of completeness for all cities
 * Contains metadata about the cities, as well as the completeness numbers
 */
export interface CompiledCompleteness {
	/**
	 * Some generic metadata about the cities, as well as the time when the statistics were last updated
	 */
	meta: {
		/**
		 * Time when the statistics were last updated
		 */
		update: string;
	};

	/**
	 * List of all cities, with their completeness numbers
	 */
	cities: {
		/**
		 * Some generic metadata about the city
		 */
		city: CityMetadata;

		/**
		 * Total number of streets in the city
		 */
		total: number;

		/**
		 * Number of streets that don't have an etymology
		 */
		unmapped: number;

		/**
		 * Percentage of streets that don't have an etymology
		 */
		unmappedPercentage: number;

		/**
		 * Number of streets that have an etymology
		 */
		mapped: number;

		/**
		 * Percentage of streets that have an etymology
		 */
		mappedPercentage: number;
	}[];
}
