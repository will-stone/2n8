import { effect, signal } from 'alien-signals'
import { autorun, makeAutoObservable } from 'mobx'
import { bench, describe } from 'vitest'

import { createStore, TwoAndEight } from './2n8.js'

describe('simple count', () => {
  bench('2n8', async () => {
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

    const subscriptionComplete = new Promise<void>((resolve) => {
      const unsubscribe = twoAndEightStore.subscribe(
        () => {
          if (twoAndEightStore.getState().count === 1) {
            unsubscribe()
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

  bench('mobx', async () => {
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

  bench('alien-signals', async () => {
    const alienSignalsCount = signal(1)

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
