import { copyFileSync } from 'node:fs'

import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: ['./src/2n8.ts'],
      formats: ['es', 'cjs'],
    },
    minify: false,
    rollupOptions: {
      external: ['auto-bind', 'react'],
    },
  },
  plugins: [
    dts({
      afterBuild: () => {
        // To pass publint (`npm x publint@latest`) and ensure the
        // package is supported by all consumers, we must export types that are
        // read as ESM. To do this, there must be duplicate types with the
        // correct extension supplied in the package.json exports field.
        copyFileSync('./dist/2n8.d.ts', './dist/2n8.d.cts')
      },
      exclude: [
        // Start a file with an underscore if you don't intend for it produce
        // a type declaration file.
        '**/_*.*',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
      include: ['src'],
    }),
  ],
})
