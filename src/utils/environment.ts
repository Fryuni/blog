import type {APIContext, AstroGlobal} from 'astro';

export type AstroContext = AstroGlobal | APIContext;

export const isBrowser = import.meta.env.SSR === false;

export function isSSR(astro: AstroContext): boolean {
  try {
    return import.meta.env.SSR && astro.clientAddress !== '';
  } catch {
    return false;
  }
}

export function isSSG(astro: AstroContext): boolean {
  return import.meta.env.SSR && !isSSR(astro);
}
