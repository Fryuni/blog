import {SITE} from '@config';
import {generateOgImage} from '@utils/generateOgImage';
import type {APIRoute} from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
  const image = await generateOgImage(SITE.title);

  return new Response(image.getPng(), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};
