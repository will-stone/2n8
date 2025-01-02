import type { FC } from 'react'

import { createReactStore, TwoAndEight } from '../../src/index.js'

class Store extends TwoAndEight {
  count = 0

  addClicked() {
    this.count = this.count + 1
  }

  resetClicked() {
    this.$reset('count')
  }
}

const useStore = createReactStore(new Store())

export const Counter: FC = () => {
  const count = useStore((state) => state.count)
  const addClicked = useStore((state) => state.addClicked)
  const resetClicked = useStore((state) => state.resetClicked)
  return (
    <div className="flex justify-center">
      <div className="inline-flex gap-4 py-8">
        <div className="font-mono text-5xl">{count}</div>
        <div className="!m-0 flex gap-4 text-2xl font-bold">
          <button
            className="!m-0 rounded bg-stone-300 px-4 dark:bg-stone-700"
            onClick={addClicked}
            type="button"
          >
            + 1
          </button>
          <button
            className="!m-0 rounded bg-stone-300 px-4 dark:bg-stone-700"
            onClick={resetClicked}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
