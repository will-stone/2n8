import config from '@will-stone/eslint-config'

export default config(
  { cwd: import.meta.dirname, tailwind: false },
  {
    // For a cleaner example.
    files: ['website/components/counter.tsx'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react/button-has-type': 'off',
    },
  },
)
