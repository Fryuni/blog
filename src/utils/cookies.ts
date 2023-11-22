import {SITE} from '@config';
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

const defaultCookieOptions = getCookieOptions(new URL(SITE.website));

export function getClientId(context: AstroContext): string | undefined {
  if (!isSSR(context)) {
    return;
  }

  const {cookies, url} = context;

  const cookieValue = cookies.get('croct_client_id')?.value;

  if (cookieValue !== undefined && cookieValue !== '') {
    console.debug('[MW] Found client ID in cookie:', cookieValue);

    return cookieValue;
  }

  console.debug('[MW] Generating a new client ID');
  const clientId = crypto.randomUUID();

  console.debug('[MW] Generated client ID:', clientId);

  cookies.set('croct_client_id', clientId, url != null ? getCookieOptions(url) : defaultCookieOptions);

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
