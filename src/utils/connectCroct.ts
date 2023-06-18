import croct from '@croct/plug';

window.croct = croct;

croct.plug({
  appId: import.meta.env.PUBLIC_CROCT_APP_ID,
});
