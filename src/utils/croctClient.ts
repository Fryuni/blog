import croct from '@croct/plug';

croct.plug({
  appId: import.meta.env.PUBLIC_CROCT_APP_ID,
  // debug: import.meta.env.DEV,
  cidAssignerEndpointUrl: new URL(
    '/api/cid-assigner',
    window.location.href,
  ).toString(),

  token: null,
  baseEndpointUrl: 'https://beta.api.croct.io',
});

window.croct = croct;

setTimeout(async () => {
  const currentTag = Date();

  await croct.user.edit().set('custom.tag', currentTag).save();

  let counter = 0;

  const interval = setInterval(async () => {
    if (counter++ > 5) {
      clearInterval(interval);
    }

    try {
      const session = await croct.evaluate("user.tag", { timeout: 2000 });

      console.log({ session, expectedTag: currentTag, matching: session === currentTag });
    } catch (err) {
      console.error(err);
    }
  }, 500);
}, 2000);

export { croct };
