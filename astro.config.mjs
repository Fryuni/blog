import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import vercel from '@astrojs/vercel/serverless';
import node from '@astrojs/node';

const adapterConfig = process.env.ASTRO_NODE_ADAPTER === 'true'
  ? defineConfig({
    adapter: node({mode: 'standalone'}),
    image: {
      service: {
        entrypoint: 'astro/assets/services/squoosh',
      },
    },
  })
  : defineConfig({
    adapter: vercel({
      functionPerRoute: false,
      imageService: true,
      edgeMiddleware: false,
      webAnalytics: {enabled: true},
      speedInsights: {enabled: true},
    }),
  });

// eslint-disable-next-line import/no-default-export -- required by Astro
export default defineConfig({
  ...adapterConfig,
  output: 'hybrid',

  trailingSlash: 'ignore',
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
      lastUpdated: true,
      favicon: '/logo/logo-no-text-dark.svg',
      logo: {
        light: './public/logo/logo-no-text.svg',
        dark: './public/logo/logo-no-text-dark.svg',
      },
      sidebar: [
        {
          label: 'Deep Dives',
          autogenerate: {
            directory: 'deep-dive',
          },
        },
        {
          label: 'Essays',
          autogenerate: {
            directory: 'essays',
            collapsed: true,
          },
        },
      ],
      components: {
        Head: './src/components/Head.astro',
        Footer: './src/components/Footer.astro',
        Sidebar: './src/components/Sidebar.astro',
      },
    }),
  ],

  vite: {
    server: {
      watch: {
        ignored: [
          '!**/node_modules/**',
          '**/dist/**',
          '**/.*/**',
        ],
      },
    },
  },
});
