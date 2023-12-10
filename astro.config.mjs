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
  output: 'server',

  trailingSlash: 'never',
  integrations: [
    starlight({
      title: 'Fryuni\'s web corner',
      social: {
        github: 'https://github.com/Fryuni',
        gitlab: 'https://gitlab.com/Fryuni',
        email: 'mailto:luiz@lferraz.com',
        reddit: 'https://reddit.com/u/fryuni',
      },
      prerender: true,
      pagefind: true,
      pagination: false,
      favicon: '/logo/logo-no-text-dark.svg',
      logo: {
        light: './public/logo/logo-no-text.svg',
        dark: './public/logo/logo-no-text-dark.svg',
      },
      tableOfContents: false,
      sidebar: [
        // {
        //   label: 'Notes',
        //   autogenerate: {
        //     directory: 'notes',
        //   },
        // },
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
        Sidebar: './src/components/Sidebar.astro',
        Footer: './src/components/Footer.astro',
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
