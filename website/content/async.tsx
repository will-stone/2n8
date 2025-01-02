import type { FC } from 'react'

import { createReactStore, TwoAndEight } from '../../src/index.js'

const dummyFetch = async () => {
  await new Promise<void>((res) => {
    setTimeout(() => {
      res()
    }, 2000)
  })
}

class Store extends TwoAndEight {
  status: 'idle' | 'pending' | 'success' = 'idle'

  async buttonClicked() {
    this.status = 'pending'
    this.$emit()
    await dummyFetch()
    this.status = 'success'
  }

  resetClicked() {
    this.$reset('status')
  }
}

const useStore = createReactStore(new Store())

export const Async: FC = () => {
  const status = useStore((state) => state.status)
  const buttonClicked = useStore((state) => state.buttonClicked)
  const resetClicked = useStore((state) => state.resetClicked)
  return (
    <div className="flex justify-center">
      <div className="flex text-2xl font-bold gap-4 !m-0 py-8">
        <span className="text-5xl w-0">&nbsp;</span>
        <button
          className="px-4 rounded !m-0 bg-stone-300 dark:bg-stone-700"
          disabled={status !== 'idle'}
          onClick={buttonClicked}
          type="button"
        >
          <span className="flex items-center gap-2">
            {status === 'idle' ? (
              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  clipRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z"
                  fillRule="evenodd"
                />
              </svg>
            ) : status === 'pending' ? (
              <svg
                className="size-6 animate-spin"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  clipRule="evenodd"
                  d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                  fillRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  clipRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  fillRule="evenodd"
                />
              </svg>
            )}
          </span>
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
  )
}
