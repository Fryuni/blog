/* eslint-disable import/no-default-export -- required by Tailwind */

import starlightTailwind from '@astrojs/starlight-tailwind';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: colors.teal,
        white: colors.zinc[200],
        gray: colors.black,
      },
      fontFamily: {
        sans: ['Atkinson Hyperlegible', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [starlightTailwind()],
};
