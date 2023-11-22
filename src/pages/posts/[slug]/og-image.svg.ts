import {generateOgImage} from '@utils/generateOgImage.tsx';
import {getPosts, slugify} from '@utils/posts.ts';
import type {APIRoute, GetStaticPathsResult} from 'astro';

export const prerender = true;

export const GET: APIRoute = async ({props}) => {
  const image = await generateOgImage(props.post.title, {
    datetime: props.post.pubDateTime,
  });

  return new Response(image.svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
};

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const posts = await getPosts();

  return posts.map(
    post => ({
      params: {slug: slugify(post.data)},
      props: {post},
    }),
  );
}
