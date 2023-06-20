import generateOgImage from '@utils/generateOgImage';
import type { APIRoute } from 'astro';
import { SITE } from '@config';

export const prerender = true;

export const get: APIRoute = ({ props }) =>
  generateOgImage(SITE.title).then(({ svg }) => ({ body: svg }));
