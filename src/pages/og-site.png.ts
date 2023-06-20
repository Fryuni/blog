import generateOgImage from '@utils/generateOgImage';
import type { APIRoute } from 'astro';
import { SITE } from '@config';

export const prerender = true;

export const get: APIRoute = ({ props }) =>
  generateOgImage(SITE.title).then(
    ({ getPng }) =>
      new Response(getPng(), {
        headers: {
          'Content-Type': 'image/png',
        },
      })
  );
