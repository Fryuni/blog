function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    // Remove the following screen breakpoint or add other breakpoints
    // if one breakpoint is not enough for you
    screens: {
      sm: '640px',
    },

    extend: {
      textColor: {
        skin: {
          base: withOpacity('--colorTextBase'),
          accent: withOpacity('--colorAccent'),
          inverted: withOpacity('--colorFill'),
        },
      },
      backgroundColor: {
        skin: {
          fill: withOpacity('--colorFill'),
          accent: withOpacity('--colorAccent'),
          inverted: withOpacity('--colorTextBase'),
          card: withOpacity('--colorCard'),
          'card-muted': withOpacity('--colorCardMuted'),
        },
      },
      outlineColor: {
        skin: {
          fill: withOpacity('--colorAccent'),
        },
      },
      borderColor: {
        skin: {
          line: withOpacity('--colorBorder'),
          fill: withOpacity('--colorTextBase'),
          accent: withOpacity('--colorAccent'),
        },
      },
      fill: {
        skin: {
          base: withOpacity('--colorTextBase'),
          accent: withOpacity('--colorAccent'),
        },
        transparent: 'transparent',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
      },

      typography: {
        DEFAULT: {
          css: {
            'blockquote p:first-of-type::before': false,
            'blockquote p:first-of-type::after': false,
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
