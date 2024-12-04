import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    starlight({
      logo: {
        src: './website/assets/logo.png',
      },
      social: {
        github: 'https://github.com/will-stone/2n8',
      },
      title: '2n8',
    }),
  ],
  outDir: './dist-website',
  publicDir: './website/public',
  srcDir: './website',
})
