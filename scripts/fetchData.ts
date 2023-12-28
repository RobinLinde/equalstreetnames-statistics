import { Octokit } from 'octokit';
import * as dotenv from 'dotenv';
import { writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { CityList, CityMetadata, CompiledStatistics, HistoryItem } from '../src/lib/@types/esn';
import centroid from '@turf/centroid';
import { FeatureCollection } from '@turf/helpers';
import type { MultiPolygon } from 'geojson';

/**
 * Parsed information about a submodule
 */
interface Submodule {
	/**
	 * Path to the submodule
	 */
	path: string;

	/**
	 * Git URL for the submodule
	 */
	url: string;

	/**
	 * In case of a GitHub repository, the owner of the repository
	 */
	owner?: string;

	/**
	 * In case of a GitHub repository, the repository name
	 */
	repo?: string;
}

interface FileHistoryList {
	[date: string]: object;
}

/**
 * JSON file format for statistics.json
 */
interface StatisticsFile {
	F: number;
	M: number;
	FX: number;
	MX: number;
	X: number;
	NB?: number;
	'+': number;
	'?': number;
	'-': number;
}

/**
 * JSON file format for sources.json
 */
interface SourcesFile {
	wikidata: number;
	csv?: number;
	config: number;
	event: number;
	'-': number;
}

/**
 * JSON file format for metadata.json
 */
interface MetadataFile {
	update: string;
	sources: SourcesFile;
	genders: StatisticsFile;
}

dotenv.config();
const outDir = 'data';
const apiKey = process.env.GITHUB_TOKEN;

/**
 * Script to fetch data from the GitHub API, which we can later convert to a convenient format.
 */
async function main() {
	// First we'll need to look at the submodules to find all repositories
	const body = await (
		await fetch(
			`https://raw.githubusercontent.com/EqualStreetNames/equalstreetnames/master/.gitmodules`
		)
	).text();

	const submodules = parseSubmodules(body).filter((submodule) =>
		submodule.path.startsWith('cities/')
	);

	const cities = await getCities();
	const cityMeta: CityMetadata[] = [];

	// Loop through each submodule
	for (const submodule of submodules) {
		// Check if the submodule has a valid owner and repo
		if (!submodule.owner || !submodule.repo) {
			console.log(`Invalid owner or repo for ${submodule.path}`);
			continue;
		}
		const owner = submodule.owner;
		const repo = submodule.repo;
		const country = submodule.path.split('/')[1];
		const city = submodule.path.split('/')[2];
		const outputDir = `${outDir}/${country}`;
		const historyItems: HistoryItem[] = [];

		// For compatibility reasons we check a couple of files:
		// - `data/statistics.json` (old format)
		// - `data/sources.json` (old format)
		// - `data/metadata.json` (new, combined format)

		const statisticsHistory = await getHistory(owner, repo, 'data/statistics.json');
		const sourcesHistory = await getHistory(owner, repo, 'data/sources.json');
		const metadataHistory = await getHistory(owner, repo, 'data/metadata.json');

		// Determine all dates for which we have data, filter out duplicates
		const dates = Object.keys(statisticsHistory)
			.concat(Object.keys(sourcesHistory))
			.concat(Object.keys(metadataHistory))
			.filter((value, index, self) => self.indexOf(value) === index)
			.sort();

		// Loop through each date
		for (const date of dates) {
			// Get the data for this date, if it exists
			const statistics = statisticsHistory[date] as StatisticsFile | undefined;
			const sources = sourcesHistory[date] as SourcesFile | undefined;
			const metadata = metadataHistory[date] as MetadataFile | undefined;

			// We should have data for at least one of the files
			if (!statistics && !sources && !metadata) {
				console.log(`No data for ${owner}/${repo}/${date}`);
				continue;
			}

			// Loop through some possible cases
			if (statistics && sources) {
				// We have both old files, we can combine them
				historyItems.push({
					date,
					values: statistics,
					sources
				});
			} else if (statistics) {
				// We only have the old statistics file, need to find an old sources file, or omit cause it might not exist

				// Check if one of the previous dates has a sources file, if so, use the last one
				const previousDates = dates.slice(0, dates.indexOf(date)).reverse();
				let previousSources: SourcesFile | undefined;
				for (const previousDate of previousDates) {
					previousSources = sourcesHistory[previousDate] as SourcesFile | undefined;
					if (previousSources) {
						break;
					}
				}

				// If we have a previous sources file, we can combine them
				if (previousSources) {
					// We have both old files, we can combine them
					historyItems.push({
						date,
						values: statistics,
						sources: previousSources
					});
				} else {
					// We only have the old statistics file, ignore
					historyItems.push({
						date,
						values: statistics,
						sources: null
					});
				}
			} else if (sources) {
				// We only have the old sources file, need to find an old statistics file, which should exist

				// Check if one of the previous dates has a statistics file, use the last one
				const previousDates = dates.slice(0, dates.indexOf(date)).reverse();
				let previousStatistics: StatisticsFile | undefined;
				for (const previousDate of previousDates) {
					previousStatistics = statisticsHistory[previousDate] as StatisticsFile | undefined;
					if (previousStatistics) {
						break;
					}
				}

				// If we have a previous statistics file, we can combine them
				if (previousStatistics) {
					// We have both old files, we can combine them
					historyItems.push({
						date,
						values: previousStatistics,
						sources
					});
				} else {
					// We only have the old sources file, should never happen
					console.log(`No (complete) data for ${owner}/${repo}/${date}`);
				}
			} else if (metadata) {
				// We have the new metadata file, we can use that
				historyItems.push({
					date,
					values: metadata.genders,
					sources: metadata.sources
				});
			} else {
				// Edge case, should not happen
				console.log(`No data for ${owner}/${repo}/${date}`);
			}
		}

		// Get some metadata for the city to write together with the statistics (as well as an overview file)
		const cityData = cities[country][city];

		// Get boundary from the submodule, can be a GeometryCollection or MultiPolygon
		const boundary = await (
			await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/data/boundary.geojson`)
		).json();

		let multiPolygon: MultiPolygon;

		// Check if the boundary is a GeometryCollection
		if (boundary.type === 'GeometryCollection') {
			// First item should be a MultiPolygon
			multiPolygon = boundary.geometries[0] as MultiPolygon;
		} else {
			// We have a MultiPolygon
			multiPolygon = boundary as MultiPolygon;
		}

		// Determine centerpoint (using @turf/centroid)
		const fc: FeatureCollection = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: {},
					geometry: multiPolygon
				}
			]
		};
		const center = centroid(fc);

		// Compile metadata
		const metadata: CityMetadata = {
			cityName: cityData.name.split(',')[0].substring(4).trim(),
			countryId: country,
			geo: {
				center: [center.geometry.coordinates[0], center.geometry.coordinates[1]]
			},
			id: city,
			name: cityData.name,
			url: cityData.url
		};

		// Add metadata to the list
		cityMeta.push(metadata);

		const output: CompiledStatistics = {
			meta: {
				...metadata,
				update: new Date().toISOString()
			},
			statistics: historyItems
		};

		console.log(`Writing ${historyItems.length} items to ${outputDir}/${city}.json`);

		// Check if the output directory exists
		if (!existsSync(outputDir)) {
			// Create the directory
			mkdirSync(outputDir, { recursive: true });
		}

		await writeFile(`${outputDir}/${city}.json`, JSON.stringify(output, null, '\t'));
	}

	// Save metadata to a file
	console.log(`Writing ${cityMeta.length} items to ${outDir}/metadata.json`);
	await writeFile(`${outDir}/metadata.json`, JSON.stringify(cityMeta, null, '\t'));
}

/**
 * Parse the .gitmodules file to get a list of all submodules.
 *
 * @param rawText Raw text of the .gitmodules file
 * @returns List of submodules
 */
function parseSubmodules(rawText: string): Submodule[] {
	const output: Submodule[] = [];

	// Split input by line
	const lines = rawText.split('\n');

	// Loop trough each set of 3 lines
	for (let i = 0; i < lines.length - 1; i += 3) {
		const path = lines[i + 1].split('=')[1].trim();
		const url = lines[i + 2].split('=')[1].trim();

		let owner = '';
		let repo = '';

		try {
			owner = url.split('/')[3];
			repo = url.split('/')[4].split('.')[0];
		} catch (e) {
			console.log(e);
		}

		output.push({
			path,
			url,
			owner,
			repo
		});
	}

	// Remove empty lines
	output.filter((line) => line.path !== '');
	output.filter((line) => line.url !== '');

	return output;
}

/**
 * Small function to get all versions of a file in a repository.
 *
 * @param owner Owner of the repository on GitHub
 * @param repo Repository name on GitHub
 * @param path Path to the file in the repository
 * @returns Object with all versions of the file, keyed by date
 */
async function getHistory(owner: string, repo: string, path: string): Promise<FileHistoryList> {
	const octokit = new Octokit({
		auth: apiKey
	});

	// Create output object
	const output: FileHistoryList = {};

	// Get all commits for this file
	const commits = await octokit.rest.repos.listCommits({
		owner,
		repo,
		path
	});

	if (commits.status !== 200) {
		throw new Error(`Error fetching commits for ${owner}/${repo}/${path}: ${commits.status}`);
	}

	// Loop through each commit
	for (const commit of commits.data) {
		// Get the file contents for this commit
		try {
			const file = await octokit.rest.repos.getContent({
				owner,
				repo,
				path,
				ref: commit.sha
			});
			// If we have contents, add it to the output
			if (file.status === 200 && commit.commit.author && commit.commit.author.date) {
				output[commit.commit.author.date] = JSON.parse(
					Buffer.from(file.data['content'], 'base64').toString('utf-8')
				);
			}
		} catch (e) {
			console.log(`Error fetching ${owner}/${repo}/${path} for ${commit.sha}`);
		}
	}

	return output;
}

async function getCities(): Promise<CityList> {
	const response = await fetch(
		'https://raw.githubusercontent.com/EqualStreetNames/module-global/master/cities.json'
	);
	return (await response.json()) as CityList;
}

main();
