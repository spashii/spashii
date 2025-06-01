import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const journal = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    publishedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    tags: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
        }),
      )
      .optional(),
    authorId: z.string().optional(),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      image: image(),
      link: z.string().url(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
    }),
})

export const collections = { journal, projects }
