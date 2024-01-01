import {docsSchema} from '@astrojs/starlight/schema';
import {z} from 'astro/zod';
import {defineCollection} from 'astro:content';

const sharedSchema = docsSchema({
  extend: z.object({
    styledDescription: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    madeByAi: z.object({
      title: z.boolean().default(false),
      tags: z.boolean().default(false),
      tagline: z.boolean().default(false),
    })
      .strict()
      .default({}),
    readingTime: z.object({
      text: z.string(),
      minutes: z.number(),
      time: z.number(),
      words: z.number(),
    })
      .strict()
      .optional(),
  }),
});

export const collections = {
  root: defineCollection({schema: sharedSchema}),
  'deep-dive': defineCollection({schema: sharedSchema}),
  essays: defineCollection({schema: sharedSchema}),
  guides: defineCollection({schema: sharedSchema}),
  notes: defineCollection({schema: sharedSchema}),
  blog: defineCollection({schema: sharedSchema}),
  // i18n: defineCollection({type: 'data', schema: i18nSchema()}),
};
