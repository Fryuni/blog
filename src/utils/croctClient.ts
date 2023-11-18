import croct from '@croct/plug';

croct.plug({
  appId: import.meta.env.PUBLIC_CROCT_APP_ID,
  debug: import.meta.env.DEV,
  cidAssignerEndpointUrl: new URL(
    '/api/cid-assigner',
    window.location.href,
  ).toString(),
});

window.croct = croct;

export {croct};
