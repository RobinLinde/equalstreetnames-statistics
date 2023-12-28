import type { PageLoad } from './$types';
import completeness from '../../../data/completeness.json';

export function load() {
	// Return the data
	return {
		completeness
	};
}
