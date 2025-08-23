import type { FC } from 'react'

import { cleanup, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { bench, describe, expect } from 'vitest'
import { create as zustandCreate } from 'zustand'

import { TwoAndEight } from './2n8.js'
import { createReactStore } from './react.js'

describe('simple count', () => {
  class TwoAndEightStore extends TwoAndEight {
    count = 0

    addButtonClicked = () => {
      this.count++
    }

    resetClicked = () => {
      this.$reset()
    }
  }

  const useStore = createReactStore(new TwoAndEightStore())

  bench('2n8', async () => {
    const Component: FC = () => {
      const count = useStore('count')
      const addButtonClicked = useStore('addButtonClicked')
      const resetClicked = useStore('resetClicked')

      return (
        <div>
          <div>Count: {count}</div>
          <button onClick={addButtonClicked} type="button">
            add
          </button>
          <button onClick={resetClicked} type="button">
            reset
          </button>
        </div>
      )
    }

    render(<Component />)
    const user = userEvent.setup()

    expect(screen.getByText('Count: 0')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'add' }))

    expect(screen.getByText('Count: 1')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'reset' }))

    expect(screen.getByText('Count: 0')).toBeVisible()

    cleanup()
  })

  class MobxStore {
    count = 0

    constructor() {
      makeAutoObservable(this)
    }

    addButtonClicked = () => {
      this.count++
    }

    resetClicked = () => {
      this.count = 0
    }
  }

  const mobxStore = new MobxStore()

  bench('mobx', async () => {
    const Component: FC = observer(() => {
      return (
        <div>
          <div>Count: {mobxStore.count}</div>
          {/* eslint-disable-next-line react/jsx-handler-names */}
          <button onClick={mobxStore.addButtonClicked} type="button">
            add
          </button>
          {/* eslint-disable-next-line react/jsx-handler-names */}
          <button onClick={mobxStore.resetClicked} type="button">
            reset
          </button>
        </div>
      )
    })

    render(<Component />)
    const user = userEvent.setup()

    expect(screen.getByText('Count: 0')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'add' }))

    expect(screen.getByText('Count: 1')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'reset' }))

    expect(screen.getByText('Count: 0')).toBeVisible()

    cleanup()
  })

  type ZustandStoreState = { count: number }

  type ZustandStoreActions = {
    addButtonClicked: () => void
    resetClicked: () => void
  }

  type ZustandStore = ZustandStoreState & ZustandStoreActions

  const useZustandStore = zustandCreate<ZustandStore>()((set) => ({
    count: 0,

    addButtonClicked: () =>
      set((state) => ({ ...state, count: state.count + 1 })),
    resetClicked: () => set((state) => ({ ...state, count: 0 })),
  }))

  bench('zustand', async () => {
    const Component: FC = () => {
      const count = useZustandStore((s) => s.count)
      const addButtonClicked = useZustandStore((s) => s.addButtonClicked)
      const resetClicked = useZustandStore((s) => s.resetClicked)

      return (
        <div>
          <div>Count: {count}</div>
          <button onClick={addButtonClicked} type="button">
            add
          </button>
          <button onClick={resetClicked} type="button">
            reset
          </button>
        </div>
      )
    }

    render(<Component />)
    const user = userEvent.setup()

    expect(screen.getByText('Count: 0')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'add' }))

    expect(screen.getByText('Count: 1')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'reset' }))

    expect(screen.getByText('Count: 0')).toBeVisible()

    cleanup()
  })
})
