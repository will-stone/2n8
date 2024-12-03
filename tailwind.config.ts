import type { Config } from 'tailwindcss'

export default {
  content: ['./website/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        handwritten:
          "'Segoe Print', 'Bradley Hand', Chilanka, TSCu_Comic, casual, cursive",
      },
    },
  },
} satisfies Config
