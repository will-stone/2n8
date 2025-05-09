import { resolve } from 'node:path'

import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  outDir: './website-dist',
  srcDir: './website',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@rsgroup/ion': resolve(import.meta.dirname, 'src', 'index.ts'),
      },
    },
  },
})
