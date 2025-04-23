import { cleanup, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { bench, describe, expect } from 'vitest'
import { create as createZustand } from 'zustand'
import { subscribeWithSelector as zustandSubscribeWithSelectorMiddleware } from 'zustand/middleware'
import { immer as zustandImmerMiddleware } from 'zustand/middleware/immer'

import { createStore } from './pickle.js'

describe('simple count', () => {
  const { useStore: usePickleStore, useDispatch } = createStore({
    initialState: { count: 0 },

    events: ({ set, reset }) => ({
      addButtonClicked() {
        set((s) => {
          s.count++
        })
      },
      resetClicked() {
        reset()
      },
    }),
  })

  bench(
    'pickle',
    async () => {
      const Component: FC = () => {
        const count = usePickleStore('count')
        const addButtonClicked = useDispatch('addButtonClicked')
        const resetClicked = useDispatch('resetClicked')

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
      expect(screen.getByText('Count: 0'))
      await user.click(screen.getByRole('button', { name: 'add' }))
      expect(screen.getByText('Count: 1'))
      await user.click(screen.getByRole('button', { name: 'reset' }))
      expect(screen.getByText('Count: 0'))
      cleanup()
    },
    { iterations: 50, warmupTime: 1000 },
  )

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

  bench(
    'mobx',
    async () => {
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
      expect(screen.getByText('Count: 0'))
      await user.click(screen.getByRole('button', { name: 'add' }))
      expect(screen.getByText('Count: 1'))
      await user.click(screen.getByRole('button', { name: 'reset' }))
      expect(screen.getByText('Count: 0'))
      cleanup()
    },
    { iterations: 50, warmupTime: 1000 },
  )

  type ZustandStoreState = { count: number }

  type ZustandStoreActions = {
    addButtonClicked: () => void
    resetClicked: () => void
  }

  type ZustandStore = ZustandStoreState & ZustandStoreActions

  const useZustandStore = createZustand<ZustandStore>()(
    zustandImmerMiddleware(
      zustandSubscribeWithSelectorMiddleware((set) => ({
        count: 0,

        addButtonClicked: () =>
          set((state) => ({ ...state, count: state.count + 1 })),
        resetClicked: () => set((state) => ({ ...state, count: 0 })),
      })),
    ),
  )

  bench(
    'zustand',
    async () => {
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
      expect(screen.getByText('Count: 0'))
      await user.click(screen.getByRole('button', { name: 'add' }))
      expect(screen.getByText('Count: 1'))
      await user.click(screen.getByRole('button', { name: 'reset' }))
      expect(screen.getByText('Count: 0'))
      cleanup()
    },
    { iterations: 50, warmupTime: 1000 },
  )
})
