import generateOgImage from '@utils/generateOgImage';
import type { APIRoute } from 'astro';
import { SITE } from '@config';

export const prerender = true;

export const GET: APIRoute = () =>
  generateOgImage(SITE.title).then(({ svg }) => ({ body: svg }));
