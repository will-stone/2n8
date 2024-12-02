import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],

    // Idempotent tests
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    sequence: { shuffle: true },
    unstubEnvs: true,
    unstubGlobals: true,
  },
})
