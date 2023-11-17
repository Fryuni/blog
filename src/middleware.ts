import { defineMiddleware } from 'astro:middleware';
import { randomUUID } from 'node:crypto';

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, cookies, locals } = context;
  locals.clientId = cookies.get('croct_client_id')?.value ?? randomUUID();

  cookies.set('croct_client_id', locals.clientId, {
    domain: new URL(request.url).hostname,
    sameSite: 'lax',
    secure: true,
    path: '/',
  });

  return next();
});
