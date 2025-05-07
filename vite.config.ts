import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: ['./src/index.ts'],
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: ['react', '@ver0/deep-equal', 'auto-bind'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  plugins: [
    dts({
      exclude: [
        // Start a file with an underscore if you don't intend for it produce
        // a type declaration file.
        '**/_*.*',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.bench.tsx',
        '**/*.bench.ts',
      ],
      include: ['src'],
      tsconfigPath: './tsconfig.json',
    }),
  ],
})
