import 'astro';
import {defineMiddleware} from 'astro:middleware';
import {randomUUID} from 'node:crypto';

export const onRequest = defineMiddleware((context, next) => {
  const {url, cookies, locals} = context;

  locals.clientId = cookies.get('croct_client_id')?.value ?? randomUUID();
  locals.croctPreview = cookies.get('croct_preview')?.value
    ?? url.searchParams.get('croct-preview')
    ?? undefined;

  const cookieOptions = {
    domain: url.hostname,
    sameSite: 'lax',
    secure: true,
    path: '/',
  } as const;

  cookies.set('croct_client_id', locals.clientId, cookieOptions);

  if (locals.croctPreview === undefined || locals.croctPreview === 'exit') {
    cookies.delete('croct_preview', cookieOptions);

    delete locals.croctPreview;
  } else {
    cookies.set('croct_preview', locals.croctPreview, cookieOptions);
  }

  return next();
});
