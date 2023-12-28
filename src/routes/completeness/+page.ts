import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import completeness from '../../../data/completeness.json';

export function load({ params }: PageLoad) {
	// Return the data
	return {
		completeness
	};
}
