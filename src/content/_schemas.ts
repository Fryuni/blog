import {z} from 'astro:content';

export const blogSchema = z.object({
  author: z.string().optional(),
  pubDateTime: z.date(),
  modifiedTime: z.date().optional(),
  title: z.string(),
  postSlug: z.string().optional(),
  draft: z.boolean().optional(),
  tags: z.array(z.string()).default(['others']),
  ogImage: z.string().optional(),
  description: z.string(),
  canonicalURL: z.string().optional(),
  madeByAI: z.object({
    tags: z.boolean(),
    title: z.boolean(),
  })
    .strict(),
})
  .strict();

export type BlogFrontmatter = z.infer<typeof blogSchema>;
