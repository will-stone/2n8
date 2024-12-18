import starlightPlugin from '@astrojs/starlight-tailwind'
import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./website/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  plugins: [starlightPlugin()],
  theme: {
    extend: {
      colors: {
        // Your preferred accent color. Indigo is closest to Starlight’s defaults.
        accent: colors.orange,
        // Your preferred gray scale. Zinc is closest to Starlight’s defaults.
        gray: colors.stone,
      },
    },
  },
}
