import { getCollection } from 'astro:content';
import generateOgImage from '@utils/generateOgImage';
import type { APIRoute } from 'astro';
import slugify from '@utils/slugify';

export const get: APIRoute = async ({ props }) => ({
  body: await generateOgImage(props.post.title, {
    datetime: props.post.pubDateTime,
  }),
});

const postImportResult = await getCollection('blog', ({ data }) => !data.draft);
const posts = Object.values(postImportResult);

export function getStaticPaths() {
  return posts
    .filter(({ data }) => !data.ogImage)
    .map(({ data }) => ({
      params: {
        ogSlug: slugify(data),
      },
      props: {
        post: data,
      },
    }));
}
