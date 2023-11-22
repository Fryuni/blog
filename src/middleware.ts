import {defineMiddleware} from 'astro:middleware';
import {getClientId, getCroctPreview} from './utils/cookies';

export const config = {
  matcher: '*',
};

export const onRequest = defineMiddleware((context, next) => {
  const {locals} = context;

  locals.clientId = getClientId(context);
  locals.croctPreview = getCroctPreview(context);

  return next();
});

// eslint-disable-next-line import/no-default-export -- Seems required for Vercel Edge Middleware
export default onRequest;
