import type { PageLoad } from './$types';
import completeness from '../../../data/completeness.json';

export function load({}: PageLoad) {
	// Return the data
	return {
		completeness
	};
}
