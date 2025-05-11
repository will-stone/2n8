import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  outDir: './website-dist',
  publicDir: './website/public',
  srcDir: './website',
  vite: {
    plugins: [tailwindcss()],
  },
})
