import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      heroImage: image().optional(),
      heroAlt: z.string().default(''),
      showHero: z.boolean().default(true),
      lang: z.enum(['en', 'it']).default('en'),
      translationKey: z.string(),
      draft: z.boolean().default(false),
    }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['en', 'it']),
    translationKey: z.string(),
    category: z.string(),
    technologies: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    order: z.number(),
  }),
});

export const collections = { blog, projects };
