import {generateOgImage} from '@utils/generateOgImage';
import {getPosts, slugify} from '@utils/posts';
import type {APIRoute, GetStaticPathsResult} from 'astro';

export const prerender = true;

export const GET: APIRoute = async ({props}) => {
  const image = await generateOgImage(props.post.title, {
    datetime: props.post.pubDateTime,
  });

  return new Response(image.getPng(), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const postImportResult = await getPosts();
  const posts = Object.values(postImportResult);

  return posts.filter(({data}) => data.ogImage != null)
    .map(
      ({data}) => ({
        params: {
          slug: slugify(data),
        },
        props: {
          post: data,
        },
      }),
    );
}
