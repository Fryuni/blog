import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
  compressHTML: true,
  integrations: [preact()]
});