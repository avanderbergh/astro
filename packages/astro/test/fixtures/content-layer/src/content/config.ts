import { defineCollection, z, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { loader } from '../loaders/post-loader.js';

const blog = defineCollection({
	loader: loader({ url: 'https://jsonplaceholder.typicode.com/posts' }),
});

const dogs = defineCollection({
	loader: file('src/data/dogs.json'),
	schema: z.object({
		breed: z.string(),
		id: z.string(),
		size: z.string(),
		origin: z.string(),
		lifespan: z.string(),
		temperament: z.array(z.string()),
	}),
});

const rodents = defineCollection({
	loader: () => ({
		capybara: {
			name: 'Capybara',
			scientificName: 'Hydrochoerus hydrochaeris',
			lifespan: 10,
			weight: 50000,
			diet: ['grass', 'aquatic plants', 'bark', 'fruits'],
			nocturnal: false,
		},
		hamster: {
			name: 'Golden Hamster',
			scientificName: 'Mesocricetus auratus',
			lifespan: 2,
			weight: 120,
			diet: ['seeds', 'nuts', 'insects'],
			nocturnal: true,
		},
		rat: {
			name: 'Brown Rat',
			scientificName: 'Rattus norvegicus',
			lifespan: 2,
			weight: 350,
			diet: ['grains', 'fruits', 'vegetables', 'meat'],
			nocturnal: true,
		},
		mouse: {
			name: 'House Mouse',
			scientificName: 'Mus musculus',
			lifespan: 1,
			weight: 20,
			diet: ['seeds', 'grains', 'fruits'],
			nocturnal: true,
		},
		guineaPig: {
			name: 'Guinea Pig',
			scientificName: 'Cavia porcellus',
			lifespan: 5,
			weight: 1000,
			diet: ['hay', 'vegetables', 'fruits'],
			nocturnal: false,
		},
	}),
	schema: z.object({
		name: z.string(),
		scientificName: z.string(),
		lifespan: z.number().int().positive(),
		weight: z.number().positive(),
		diet: z.array(z.string()),
		nocturnal: z.boolean(),
	}),
});

const cats = defineCollection({
	loader: async function () {
		return [
			{
				breed: 'Siamese',
				id: 'siamese',
				size: 'Medium',
				origin: 'Thailand',
				lifespan: '15 years',
				temperament: ['Active', 'Affectionate', 'Social', 'Playful'],
			},
			{
				breed: 'Persian',
				id: 'persian',
				size: 'Medium',
				origin: 'Iran',
				lifespan: '15 years',
				temperament: ['Calm', 'Affectionate', 'Social'],
			},
			{
				breed: 'Tabby',
				id: 'tabby',
				size: 'Medium',
				origin: 'Egypt',
				lifespan: '15 years',
				temperament: ['Curious', 'Playful', 'Independent'],
			},
			{
				breed: 'Ragdoll',
				id: 'ragdoll',
				size: 'Medium',
				origin: 'United States',
				lifespan: '15 years',
				temperament: ['Calm', 'Affectionate', 'Social'],
			},
		];
	},
	schema: z.object({
		breed: z.string(),
		id: z.string(),
		size: z.string(),
		origin: z.string(),
		lifespan: z.string(),
		temperament: z.array(z.string()),
	}),
});

// Absolute paths should also work
const absoluteRoot = new URL('../../content/space', import.meta.url);

const spacecraft = defineCollection({
	loader: glob({ pattern: '*.md', base: absoluteRoot }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			publishedDate: z.coerce.date(),
			tags: z.array(z.string()),
			heroImage: image().optional(),
			cat: reference('cats').optional(),
			something: z
				.string()
				.optional()
				.transform((str) => ({ type: 'test', content: str })),
		}),
});

const probes = defineCollection({
	loader: glob({ pattern: ['*.md', '!voyager-*'], base: 'src/data/space-probes' }),
	schema: z.object({
		name: z.string(),
		type: z.enum(['Space Probe', 'Mars Rover', 'Comet Lander']),
		launch_date: z.date(),
		status: z.enum(['Active', 'Inactive', 'Decommissioned']),
		destination: z.string(),
		operator: z.string(),
		notable_discoveries: z.array(z.string()),
	}),
});

const numbers = defineCollection({
	loader: glob({ pattern: 'src/data/glob-data/*', base: '.' }),
});

const images = defineCollection({
	loader: () => [
		{
			id: '1',
			image: '@images/shuttle.jpg',
		},
		{
			id: '2',
			image: 'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=800&fm=jpg&fit=crop',
		},
	],
	schema: ({ image }) =>
		z.object({
			id: z.string(),
			image: image(),
		}),
});

const increment = defineCollection({
	loader: {
		name: 'increment-loader',
		load: async ({ store, refreshContextData }) => {
			const entry = store.get<{ lastValue: number }>('value');
			const lastValue = entry?.data.lastValue ?? 0;
			store.set({
				id: 'value',
				data: {
					lastValue: lastValue + 1,
					lastUpdated: new Date(),
					refreshContextData,
				},
			});
		},
		// Example of a loader that returns an async schema function
		schema: async () =>
			z.object({
				lastValue: z.number(),
				lastUpdated: z.date(),
				refreshContextData: z.record(z.unknown()),
			}),
	},
});

export const collections = {
	blog,
	dogs,
	cats,
	numbers,
	spacecraft,
	increment,
	images,
	probes,
	rodents,
};
