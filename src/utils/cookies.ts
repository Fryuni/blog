import type {AstroCookies} from 'astro';
import {type AstroContext, isSSR} from './environment';

type AstroCookieSetOptions = NonNullable<Parameters<AstroCookies['set']>[2]>;

export function getCookieOptions(url: URL): AstroCookieSetOptions {
  return {
    domain: url.hostname,
    sameSite: 'lax',
    httpOnly: true,
    secure: true,
    path: '/',
  };
}

export function getClientId(context: AstroContext): string | undefined {
  if (!isSSR(context)) {
    return;
  }

  const {cookies, url} = context;

  const cookieValue = cookies.get('croct_client_id')?.value;

  if (cookieValue !== undefined && cookieValue !== '') {
    return cookieValue;
  }

  const clientId = crypto.randomUUID();

  cookies.set('croct_client_id', clientId, getCookieOptions(url));

  return clientId;
}

export function getCroctPreview(context: AstroContext): string | undefined {
  if (!isSSR(context)) {
    return;
  }

  const {cookies, url} = context;

  const queryValue = url.searchParams.get('croct-preview');
  const cookieValue = cookies.get('croct_preview')?.value;

  if (queryValue == null && cookieValue == null) {
    return;
  }

  switch (queryValue) {
    case null:
    case undefined:
    case '':
    case cookieValue:
      return cookieValue;

    case 'exit':
      cookies.delete('croct_preview', getCookieOptions(url));
      return;

    default:
      cookies.set('croct_preview', queryValue, getCookieOptions(url));
      return queryValue;
  }
}
