import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import vercel from '@astrojs/vercel/serverless';

// eslint-disable-next-line import/no-default-export -- required by Astro
export default defineConfig({
  output: 'server',
  adapter: vercel({
    functionPerRoute: false,
    imageService: true,
    edgeMiddleware: false,
    webAnalytics: {enabled: true},
    speedInsights: {enabled: true},
  }),

  trailingSlash: 'never',
  integrations: [
    starlight({
      title: 'Fryuni\'s web corner',
      social: {
        github: 'https://github.com/Fryuni',
        gitlab: 'https://gitlab.com/Fryuni',
        email: 'mailto:luiz@lferraz.com',
      },
      pagefind: false,
      pagination: false,
      favicon: '/logo/logo-no-text-dark.svg',
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: 'Example Guide',
              link: '/guides/example/',
            },
          ],
        },
        {
          label: 'Reference',
          autogenerate: {
            directory: 'reference',
          },
        },
      ],
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
