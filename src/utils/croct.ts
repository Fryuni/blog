import croct from '@croct/plug';

croct.plug({
  appId: import.meta.env.PUBLIC_CROCT_APP_ID,
  debug: import.meta.env.DEV,
});

export default croct;
