import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { TwoAndEight } from './2n8.js'

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

test('should update when using async actions', async () => {
  class Store extends TwoAndEight {
    count = 0

    buttonClicked() {
      this.count = this.count + 1
    }

    async asyncButtonClicked() {
      this.count = this.count + 1
      await new Promise((res) => {
        setTimeout(res, 3000)
      })
      this.count = this.count + 5
    }
  }

  const store = new Store()
  expect(store.count).toBe(0)
  store.buttonClicked()
  expect(store.count).toBe(1)
  store.asyncButtonClicked()
  expect(store.count).toBe(2)
  await vi.advanceTimersByTimeAsync(10_001)
  expect(store.count).toBe(7)
})

test('should reset all state', () => {
  class Store extends TwoAndEight {
    untouched = true
    toggle: boolean | 'a string' = false
    greeting = 'hello'
    count = 999

    increment() {
      this.count = this.count + 1
    }

    gone() {
      this.greeting = 'bye'
    }

    switched() {
      if (this.toggle === true) {
        this.toggle = 'a string'
      } else if (this.toggle === false) {
        this.toggle = true
      } else {
        this.toggle = false
      }
    }
  }

  const store = new Store()

  expect(store.greeting).toBe('hello')
  expect(store.count).toBe(999)
  expect(store.toggle).toBe(false)
  expect(store.untouched).toBe(true)

  store.switched()
  store.switched()
  store.increment()
  store.gone()

  expect(store.greeting).toBe('bye')
  expect(store.count).toBe(1000)
  expect(store.toggle).toBe('a string')
  expect(store.untouched).toBe(true)

  store.$reset()

  expect(store.greeting).toBe('hello')
  expect(store.count).toBe(999)
  expect(store.toggle).toBe(false)
  expect(store.untouched).toBe(true)
})

test('should reset single field', () => {
  class Store extends TwoAndEight {
    untouched = true
    count = 999

    increment() {
      this.count = this.count + 1
    }
  }

  const store = new Store()
  store.$reset('count')
  expect(store.count).toBe(999)
  expect(store.untouched).toBe(true)
  store.increment()
  expect(store.count).toBe(1000)
  expect(store.untouched).toBe(true)
  store.$reset('count')
  expect(store.count).toBe(999)
  expect(store.untouched).toBe(true)
})

test('should compute derived value', () => {
  class Store extends TwoAndEight {
    count = 1
    count2 = 3

    get total() {
      return this.count + this.count2
    }

    increaseCount() {
      this.count = this.count + 1
    }
  }

  const store = new Store()
  expect(store.total).toBe(4)
  store.increaseCount()
  expect(store.total).toBe(5)
})

test('should throw if attempting to reset an action', () => {
  class Store extends TwoAndEight {
    count = 0

    increaseCount() {
      this.count = this.count + 1
    }
  }

  const store = new Store()
  expect(() => store.$reset('increaseCount')).toThrow(
    '2n8: Cannot reset a method.',
  )
  expect(() => store.$reset('$reset')).toThrow('2n8: Cannot reset a method.')
  expect(() => store.$reset('$subscribe')).toThrow(
    '2n8: Cannot reset a method.',
  )
})

test('should return initial state', () => {
  class Store extends TwoAndEight {
    count = 0
    untouched = 'foo'

    increaseCount() {
      this.count = this.count + 1
    }
  }

  const store = new Store()
  store.increaseCount()
  expect(store.$getInitialState()).toStrictEqual({
    count: 0,
    untouched: 'foo',
  })
})

test('should return state', () => {
  class Store extends TwoAndEight {
    count = 0
    untouched = 'foo'

    increaseCount() {
      this.count = this.count + 1
    }
  }

  const store = new Store()
  expect(store.$getState()).toStrictEqual({
    count: 0,
    untouched: 'foo',
  })
  store.increaseCount()
  expect(store.$getState()).toStrictEqual({
    count: 1,
    untouched: 'foo',
  })
})
