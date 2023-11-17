import croct from '@croct/plug';

croct.plug({
  appId: import.meta.env.PUBLIC_CROCT_APP_ID,
  debug: import.meta.env.DEV,
});

try {
  window.croct = croct;
} catch {
  // Ignore, window is not available
}

export default croct;
