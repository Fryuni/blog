import croct from '@croct/plug';

croct.plug({
  appId: import.meta.env.PUBLIC_CROCT_APP_ID,
  // debug: import.meta.env.DEV,
  cidAssignerEndpointUrl: new URL(
    '/api/cid-assigner',
    window.location.href,
  ).toString(),

  baseEndpointUrl: 'https://beta.api.croct.io',
});

window.croct = croct;

setTimeout(async () => {
  const currentTag = Date();

  await croct.user.edit().set('custom.tag', currentTag).save();

  let counter = 0;

  const interval = setInterval(async () => {
    if (counter++ > 10) {
      clearInterval(interval);
    }

    try {
      const readTag = await croct.evaluate("user's tag", { timeout: 2000 });

      console.log({ readTag, expectedTag: currentTag });
    } catch (err) {
      console.error(err);
    }
  }, 2000);
}, 2000);

export { croct };
