import {docsSchema} from '@astrojs/starlight/schema';
import {z} from 'astro/zod';
import {defineCollection} from 'astro:content';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        customViewTransitions: z.boolean().default(true),
      }),
    }),
  }),
  // i18n: defineCollection({type: 'data', schema: i18nSchema()}),
};
