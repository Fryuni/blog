import { getCollection } from 'astro:content';
import generateOgImage from '@utils/generateOgImage';
import type { APIRoute } from 'astro';
import slugify from '@utils/slugify';

export const prerender = true;

export const get: APIRoute = async ({ props }) =>
  generateOgImage(props.post.title, {
    datetime: props.post.pubDateTime,
  }).then(({ svg }) => ({ body: svg }));

const postImportResult = await getCollection('blog', ({ data }) => !data.draft);
const posts = Object.values(postImportResult);

export function getStaticPaths() {
  return posts
    .filter(({ data }) => !data.ogImage)
    .map(({ data }) => ({
      params: {
        slug: slugify(data),
      },
      props: {
        post: data,
      },
    }));
}
