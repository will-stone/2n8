import { effect, signal } from 'alien-signals'
import { autorun, makeAutoObservable } from 'mobx'
import { bench, describe } from 'vitest'

import { createStore, TwoAndEight } from './2n8.js'

describe('2n8', () => {
  bench('simple count', async () => {
    class Store extends TwoAndEight {
      count = 0

      increaseCount() {
        this.count = this.count + 1
      }

      resetAll() {
        this.$reset()
      }
    }

    const store = createStore(new Store())

    const subscriptionComplete = new Promise<void>((resolve) => {
      const unsubscribe = store.subscribe(
        () => {
          if (store.getState().count === 1) {
            unsubscribe()
            resolve()
          }
        },
        (s) => s.count,
      )
    })

    store.getState().increaseCount()

    await subscriptionComplete
    store.getState().resetAll()
  })
})

describe('mobx', () => {
  bench('simple count', async () => {
    class Store {
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

    const store = new Store()

    const subscriptionComplete = new Promise<void>((resolve) => {
      autorun(() => {
        if (store.count === 1) {
          resolve()
        }
      })
    })

    store.increaseCount()

    await subscriptionComplete
    store.resetAll()
  })
})

describe('alien-signals', () => {
  bench('simple count', async () => {
    const count = signal(1)

    const subscriptionComplete = new Promise<void>((resolve) => {
      effect(() => {
        if (count.get() === 1) {
          resolve()
        }
      })
    })

    count.set(1)
    await subscriptionComplete
    count.set(0)
  })
})
