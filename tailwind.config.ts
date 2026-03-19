import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        matcha: {
          50: '#f3f9ee',
          100: '#e2f0d5',
          200: '#c5e2ac',
          300: '#9cce7a',
          400: '#75b650',
          500: '#569a34',
          600: '#417a26',
          700: '#345f20',
          800: '#2c4d1f',
          900: '#26401d',
        },
      },
    },
  },
  plugins: [],
}

export default config
