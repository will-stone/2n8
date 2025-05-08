'use client'

import type { FC } from 'react'

import { useStore } from './store'

export const Count: FC = () => {
  const count = useStore('count')

  return <span>{count}</span>
}
