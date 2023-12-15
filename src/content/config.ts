import {docsSchema} from '@astrojs/starlight/schema';
import {z} from 'astro/zod';
import {defineCollection} from 'astro:content';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        tags: z.array(z.string()).default([]),
        madeByAi: z.object({
          title: z.boolean().default(false),
          tags: z.boolean().default(false),
          tagline: z.boolean().default(false),
        })
          .strict()
          .default({}),
      }),
    }),
  }),
  // i18n: defineCollection({type: 'data', schema: i18nSchema()}),
};
