import {defineMiddleware} from 'astro:middleware';

function generateClientId(): string {
  console.log('[MW] Generating a new client ID');
  const clientId = crypto.randomUUID();

  console.log('[MW] Generated client ID:', clientId);

  return clientId;
}

export const onRequest = defineMiddleware((context, next) => {
  const {url, cookies, locals} = context;

  locals.clientId = cookies.get('croct_client_id')?.value ?? generateClientId();
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
