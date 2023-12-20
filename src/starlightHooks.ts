import {defineRouteHook} from '@astrojs/starlight/hooks';

export const routeHook = defineRouteHook(route => {
  if (import.meta.env.PROD && route.entry.data.draft) {
    return;
  }

  return route;
});
