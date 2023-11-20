import {defineMiddleware} from 'astro:middleware';
import {getClientId, getCroctPreview} from './utils/cookies';

export const config = {
  matcher: '*',
};

export const onRequest = defineMiddleware((context, next) => {
  const {url, cookies, locals} = context;

  locals.clientId = getClientId(cookies, url);
  locals.croctPreview = getCroctPreview(cookies, url);

  return next();
});

// eslint-disable-next-line import/no-default-export -- Seems required for Vercel Edge Middleware
export default onRequest;
