'use client'

import type { FC } from 'react'

import { useStore } from './store'

export const Derived: FC = () => {
  const derived = useStore('derived')

  return <span>{derived}</span>
}
