import { autorun, makeAutoObservable } from 'mobx'
import { bench, describe } from 'vitest'
import { createStore as zustandCreateStore } from 'zustand/vanilla'

import { createStore, TwoAndEight } from './2n8.js'

describe('simple count', () => {
  class TwoAndEightStore extends TwoAndEight {
    count = 0

    increaseCount() {
      this.count = this.count + 1
    }

    resetAll() {
      this.$reset()
    }
  }

  const { store: twoAndEightStore, subscribe: twoAndEightSubscribe } =
    createStore(new TwoAndEightStore())

  bench('2n8', async () => {
    const subscriptionComplete = new Promise<void>((resolve) => {
      twoAndEightSubscribe(() => {
        if (twoAndEightStore.count === 1) {
          resolve()
        }
      })
    })

    twoAndEightStore.increaseCount()
    await subscriptionComplete
    twoAndEightStore.resetAll()
  })

  class MobxStore {
    count = 0

    constructor() {
      makeAutoObservable(this)
    }

    increaseCount = () => {
      this.count = this.count + 1
    }

    resetAll = () => {
      this.count = 0
    }
  }

  const mobxStore = new MobxStore()

  bench('mobx', async () => {
    const subscriptionComplete = new Promise<void>((resolve) => {
      autorun(() => {
        if (mobxStore.count === 1) {
          resolve()
        }
      })
    })

    mobxStore.increaseCount()

    await subscriptionComplete
    mobxStore.resetAll()
  })

  type ZustandStoreState = { count: number }

  type ZustandStoreActions = {
    increaseCount: () => void
    resetAll: () => void
  }

  type ZustandStore = ZustandStoreState & ZustandStoreActions

  const zustandStore = zustandCreateStore<ZustandStore>()((set) => ({
    count: 0,
    increaseCount: () => set((state) => ({ ...state, count: state.count + 1 })),
    resetAll: () => set((state) => ({ ...state, count: 0 })),
  }))

  bench('zustand', async () => {
    const subscriptionComplete = new Promise<void>((resolve) => {
      zustandStore.subscribe((state) => {
        if (state.count === 1) {
          resolve()
        }
      })
    })

    zustandStore.getState().increaseCount()
    await subscriptionComplete
    zustandStore.getState().resetAll()
  })
})
