import type {APIRoute} from 'astro';

export const GET: APIRoute = ctx => {
  const sdkCid = ctx.url
    .searchParams
    .get('cid');
  const astroCid = ctx.locals.clientId;

  if (sdkCid !== null && sdkCid !== astroCid) {
    console.warn(
      `SDK CID (${sdkCid}) and Astro CID (${astroCid}) are different.`,
    );
  }

  return new Response(ctx.locals.clientId, {
    status: 200,
  });
};
