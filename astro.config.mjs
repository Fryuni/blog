import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import remarkToc from 'remark-toc';
import remarkCollapse from 'remark-collapse';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';
// noinspection ES6PreferShortImport -- This is not TS, so path aliases don't work
import { SITE } from './src/config';

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: 'hybrid',
  adapter: vercel({
    functionPerRoute: false,
    imageService: true,
    edgeMiddleware: true,
  }),

  trailingSlash: 'never',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: 'Table of contents',
        },
      ],
    ],
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
  vite: {
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
    server: {
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.*/**',
        ],
      }
    }
  },
});
