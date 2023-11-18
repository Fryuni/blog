import {type AstroCookies} from 'astro';
import {defineMiddleware} from 'astro:middleware';

export const config = {
  matcher: '*',
};

function getClientId(cookies: AstroCookies): string {
  const cookieValue = cookies.get('croct_client_id')?.value;

  if (cookieValue !== undefined && cookieValue !== '') {
    console.debug('[MW] Found client ID in cookie:', cookieValue);

    return cookieValue;
  }

  console.log('[MW] Generating a new client ID');
  const clientId = crypto.randomUUID();

  console.log('[MW] Generated client ID:', clientId);

  return clientId;
}

export const onRequest = defineMiddleware((context, next) => {
  const {url, cookies, locals} = context;

  locals.clientId = getClientId(cookies);
  locals.croctPreview = url.searchParams.get('croct-preview')
    ?? cookies.get('croct_preview')?.value
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

// eslint-disable-next-line import/no-default-export -- Seems required for Vercel Edge Middleware
export default onRequest;
