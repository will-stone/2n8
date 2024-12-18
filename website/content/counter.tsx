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

const Counter: FC = () => {
  const count = useStore((state) => state.count)
  const addClicked = useStore((state) => state.addClicked)
  const resetClicked = useStore((state) => state.resetClicked)
  return (
    <div className="flex justify-center">
      <div className="inline-flex border-8 border-stone-200 dark:border-stone-800 rounded-xl gap-4 p-4">
        <div className="font-mono text-5xl">{count}</div>
        <div className="flex text-2xl font-bold gap-4 !m-0">
          <button
            className="px-4 rounded !m-0 bg-stone-300 dark:bg-stone-700"
            onClick={addClicked}
            type="button"
          >
            + 1
          </button>
          <button
            className="px-4 rounded !m-0 bg-stone-300 dark:bg-stone-700"
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

export default Counter
