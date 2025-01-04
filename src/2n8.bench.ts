import { effect, signal } from 'alien-signals'
import { autorun, makeAutoObservable } from 'mobx'
import { bench, describe } from 'vitest'

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

  const twoAndEightStore = createStore(new TwoAndEightStore())

  bench('2n8', async () => {
    const subscriptionComplete = new Promise<void>((resolve) => {
      twoAndEightStore.subscribe(
        () => {
          if (twoAndEightStore.getState().count === 1) {
            resolve()
          }
        },
        (s) => s.count,
      )
    })

    twoAndEightStore.getState().increaseCount()
    await subscriptionComplete
    twoAndEightStore.getState().resetAll()
  })

  class MobxStore {
    count = 0

    constructor() {
      makeAutoObservable(this)
    }

    increaseCount() {
      this.count = this.count + 1
    }

    resetAll() {
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

  const alienSignalsCount = signal(1)

  bench('alien-signals', async () => {
    const subscriptionComplete = new Promise<void>((resolve) => {
      effect(() => {
        if (alienSignalsCount.get() === 1) {
          resolve()
        }
      })
    })

    alienSignalsCount.set(1)
    await subscriptionComplete
    alienSignalsCount.set(0)
  })
})
