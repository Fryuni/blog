import generateOgImage from '@utils/generateOgImage';
import type { APIRoute } from 'astro';
import { SITE } from '@config';

export const get: APIRoute = async ({ props }) => ({
  body: await generateOgImage(SITE.title),
});
