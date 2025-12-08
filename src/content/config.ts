import { defineCollection, z } from 'astro:content';

const quiz = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        timePerQuestion: z.number().default(30),
        questions: z.array(
            z.object({
                question: z.string(),
                options: z.array(z.string()),
                correctAnswer: z.number(),
                points: z.number().default(100),
            })
        ),
    }),
});

export const collections = { quiz };
