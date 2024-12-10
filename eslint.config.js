import config from '@will-stone/eslint-config'

export default [
  ...config(),
  {
    files: ['**/*.{spec,test}.{js,cjs,mjs,jsx,ts,tsx}'],
    rules: { 'vitest/no-focused-tests': ['error', { fixable: false }] },
  },
]
