import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			heroImage: image().optional(),
		}),
});

const quiz = defineCollection({
	// Load MDX files in the `src/content/quiz/` directory.
	loader: glob({ base: './src/content/quiz', pattern: '**/*.mdx' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		timePerQuestion: z.number().default(30), // seconds
		questions: z.array(z.object({
			question: z.string(),
			options: z.array(z.string()),
			correctAnswer: z.number(),
			points: z.number().default(100)
		}))
	}),
});

export const collections = { blog, quiz };
