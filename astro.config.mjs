/* eslint-disable import/no-default-export -- required by Astro */

import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import vercel from '@astrojs/vercel/serverless';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
import starlightLinksValidator from 'starlight-links-validator';
import {remarkReadTimePlugin} from './plugins/readTimePlugin';

const adapterConfig = process.env.VERCEL === '1'
  ? defineConfig({
    adapter: vercel({
      functionPerRoute: false,
      imageService: true,
      edgeMiddleware: false,
      webAnalytics: {enabled: true},
      speedInsights: {enabled: true},
    }),
  })
  : defineConfig({
    adapter: node({mode: 'standalone'}),
    image: {
      service: {
        entrypoint: 'astro/assets/services/squoosh',
      },
    },
  });

// https://astro.build/config
export default defineConfig({
  ...adapterConfig,
  site: 'https://fryuni.dev',
  output: 'hybrid',

  trailingSlash: 'ignore',
  compressHTML: import.meta.env.PROD,
  integrations: [
    starlight({
      title: 'Fryuni\'s web corner',
      social: {
        github: 'https://github.com/Fryuni',
        gitlab: 'https://gitlab.com/Fryuni',
        reddit: 'https://reddit.com/u/fryuni',
        email: 'mailto:luiz@lferraz.com',
      },
      prerender: true,
      pagefind: true,
      pagination: false,
      publicationDates: true,
      favicon: '/logo/logo-no-text-dark.svg',
      logo: {
        light: './public/logo/logo-no-text.svg',
        dark: './public/logo/logo-no-text-dark.svg',
      },
      sidebar: [
        {
          label: 'Microblog',
          autogenerate: {
            directory: 'blog',
            collapsed: false,
          },
        },
        {
          label: 'Guides',
          autogenerate: {
            directory: 'guides',
            collapsed: false,
          },
        },
        {
          label: 'Deep Dives',
          autogenerate: {
            directory: 'deep-dive',
            collapsed: false,
          },
        },
        {
          label: 'Notes',
          autogenerate: {
            directory: 'notes',
            collapsed: false,
          },
        },
        {
          label: 'Essays',
          collapsed: false,
          autogenerate: {
            directory: 'essays',
          },
        },
      ],
      components: {
        Head: './src/components/Head.astro',
        Footer: './src/components/Footer.astro',
        Sidebar: './src/components/Sidebar.astro',
        PageTitle: './src/components/PageTitle.astro',
      },
      customCss: [
        './src/tailwind.css',
      ],
      plugins: [
        starlightLinksValidator(),
      ],
      hooks: './src/starlightHooks.ts',
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkReadTimePlugin,
    ],
  },
  vite: {
    build: {
      sourcemap: true,
    },
    server: {
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.*/**',
          '!.astro/**',
          '!plugins/**',
          'templates/**',
        ],
      },
    },
  },
});
