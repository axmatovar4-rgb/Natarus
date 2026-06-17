import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8f0f3',
          100: '#c5d9e0',
          500: '#2d6a7a',
          600: '#1a3a4a',
          700: '#122a38',
        },
        natarus: {
          dark:   '#1a3a4a',
          mid:    '#2d6a7a',
          light:  '#e8f0f3',
          gold:   '#f5a623',
          link:   '#0066cc',
          white:  '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'scroll-up': {
          '0%':   { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
      animation: {
        'scroll-up': 'scroll-up 8s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
