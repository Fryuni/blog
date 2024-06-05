/*
 * Copyright (c) 2024.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* eslint-disable import/no-default-export -- required by Astro */

import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import vercel from '@astrojs/vercel/serverless';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
import starlightLinksValidator from 'starlight-links-validator';
import astroMetaTags from 'astro-meta-tags';
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

  devToolbar: {
    enabled: true,
  },

  trailingSlash: 'ignore',
  compressHTML: import.meta.env.PROD,
  integrations: [
    starlight({
      title: 'Logical Elixirs',
      // I'm not using the built-in credits footer but I for sure want this to be here
      // ❤️ Starlight
      // credits: true
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
      favicon: '/logo/simple-color.png',
      logo: {
        light: './public/logo/simple-dark.svg',
        dark: './public/logo/simple-light.svg',
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
    astroMetaTags(),
  ],
  markdown: {
    remarkPlugins: [
      remarkReadTimePlugin,
    ],
  },
  vite: {
    server: {
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '!.astro/**',
          '!plugins/**',
          'templates/**',
        ],
      },
    },
  },
  experimental: {
    globalRoutePriority: true,
  },
});
