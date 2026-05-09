'use client'

import type { FC } from 'react'

import { useStore } from './store'

export const Buttons: FC = () => {
  const buttonClicked = useStore('buttonClicked')
  const asyncButtonClicked = useStore('asyncButtonClicked')

  return (
    <div>
      <button onClick={buttonClicked} type="button">
        Button
      </button>
      {/* eslint-disable-next-line @typescript-eslint/strict-void-return */}
      <button onClick={asyncButtonClicked} type="button">
        Async Button
      </button>
    </div>
  )
}
