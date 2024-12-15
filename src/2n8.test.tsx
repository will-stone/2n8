import { afterEach, beforeEach, expect, expectTypeOf, test, vi } from 'vitest'

import { createStore, TwoAndEight } from './2n8.js'

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
      this.$commit()
      await new Promise((res) => {
        setTimeout(res, 3000)
      })
      this.count = this.count + 5
    }
  }

  const store = createStore(new Store())
  expectTypeOf(store.count).toMatchTypeOf<number>()
  expect(store.count).toBe(0)
  store.buttonClicked()
  expect(store.count).toBe(1)
  store.asyncButtonClicked()
  expect(store.count).toBe(2)
  await vi.advanceTimersByTimeAsync(2999)
  expect(store.count).toBe(2)
  await vi.advanceTimersByTimeAsync(1)
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

    resetAll() {
      this.$reset()
    }
  }

  const store = createStore(new Store())

  expect(store.greeting).toBe('hello')
  expectTypeOf(store.greeting).toMatchTypeOf<string>()
  expect(store.count).toBe(999)
  expectTypeOf(store.count).toMatchTypeOf<number>()
  expect(store.toggle).toBe(false)
  expectTypeOf(store.toggle).toMatchTypeOf<boolean | 'a string'>()
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

  store.switched()
  store.switched()
  store.increment()
  store.gone()

  expect(store.greeting).toBe('bye')
  expect(store.count).toBe(1000)
  expect(store.toggle).toBe('a string')
  expect(store.untouched).toBe(true)

  store.resetAll()

  expect(store.greeting).toBe('hello')
  expect(store.count).toBe(999)
  expect(store.toggle).toBe(false)
  expect(store.untouched).toBe(true)
})

test('should reset single field', () => {
  class Store extends TwoAndEight {
    untouched = true
    greeting = 'hello'
    count = 999

    increment() {
      this.count = this.count + 1
    }

    gone() {
      this.greeting = 'bye'
    }

    resetCount() {
      this.$reset('count')
    }
  }

  const store = createStore(new Store())
  store.$reset('count')
  expect(store.count).toBe(999)
  expect(store.greeting).toBe('hello')
  expect(store.untouched).toBe(true)
  store.increment()
  store.gone()
  expect(store.count).toBe(1000)
  expect(store.greeting).toBe('bye')
  expect(store.untouched).toBe(true)
  store.$reset('count')
  expect(store.count).toBe(999)
  expect(store.greeting).toBe('bye')
  expect(store.untouched).toBe(true)
  store.increment()
  expect(store.count).toBe(1000)
  expect(store.greeting).toBe('bye')
  expect(store.untouched).toBe(true)
  store.resetCount()
  expect(store.count).toBe(999)
  expect(store.greeting).toBe('bye')
  expect(store.untouched).toBe(true)
})

test('should reset complex state', () => {
  class Store extends TwoAndEight {
    arr = [{ foo: 'bar' }]

    change() {
      this.arr[0].foo = 'moo'
    }

    reset() {
      this.$reset('arr')
    }
  }

  const store = createStore(new Store())
  expect(store.arr).toStrictEqual([{ foo: 'bar' }])
  store.change()
  expect(store.arr).toStrictEqual([{ foo: 'moo' }])
  store.reset()
  expect(store.arr).toStrictEqual([{ foo: 'bar' }])
})

test('should not mutate external objects', () => {
  const initialState = {
    obj: {
      foo: 'bar',
    },
  }

  class Store extends TwoAndEight {
    obj = structuredClone(initialState.obj)

    change() {
      this.obj.foo = 'moo'
    }
  }

  const store = createStore(new Store())
  expect(store.obj).toStrictEqual({ foo: 'bar' })
  expect(initialState).toStrictEqual({ obj: { foo: 'bar' } })
  store.change()
  expect(store.obj).toStrictEqual({ foo: 'moo' })
  expect(initialState).toStrictEqual({ obj: { foo: 'bar' } })
  store.$reset()
  expect(store.obj).toStrictEqual({ foo: 'bar' })
  expect(initialState).toStrictEqual({ obj: { foo: 'bar' } })
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

  const store = createStore(new Store())
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

  const store = createStore(new Store())
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

  const store = createStore(new Store())
  store.increaseCount()
  expect(store.$getInitialState()).toStrictEqual({
    count: 0,
    untouched: 'foo',
  })
  expectTypeOf(store.$getInitialState().count).toMatchTypeOf<number>()
  expectTypeOf(store.$getInitialState().untouched).toMatchTypeOf<string>()
})

test('should return current state', () => {
  class Store extends TwoAndEight {
    count = 0
    untouched = 'foo'

    get derived() {
      return this.count + 10
    }

    increaseCount() {
      this.count = this.count + 1
    }
  }

  const store = createStore(new Store())
  store.increaseCount()
  expect(store.$getState()).toStrictEqual({
    count: 1,
    derived: 11,
    untouched: 'foo',
  })
  expectTypeOf(store.$getState().count).toMatchTypeOf<number>()
  expectTypeOf(store.$getState().untouched).toMatchTypeOf<string>()
})

test.skip('should allow granular subscriptions', () => {
  class Store extends TwoAndEight {
    count = 0
    untouched = 'foo'

    increaseCount() {
      this.count = this.count + 1
    }
  }

  const store = createStore(new Store())
  expectTypeOf(store.$subscribe).toMatchTypeOf<
    (
      callback: () => void,
      selector?: (state: {
        count: number
        untouched: string
      }) => number | string,
    ) => void
  >()
  const countSpy = vi.fn()
  const untouchedSpy = vi.fn()
  store.$subscribe(countSpy, (s) => s.count)
  store.$subscribe(untouchedSpy, (s) => s.untouched)
  store.increaseCount()
  expect(countSpy).toHaveBeenCalledOnce()
  expect(untouchedSpy).not.toHaveBeenCalled()
})

test.skip('should allow granular subscriptions to derived state', () => {
  class Store extends TwoAndEight {
    count = 0

    get derived() {
      return this.count + 10
    }

    increaseCount() {
      this.count = this.count + 1
    }
  }

  const store = createStore(new Store())
  const derivedSpy = vi.fn()
  store.$subscribe(derivedSpy, (s) => s.derived)
  store.increaseCount()
  expect(derivedSpy).toHaveBeenCalledOnce()
})

test.skip('should not call listener when state has not changed', () => {
  class Store extends TwoAndEight {
    count = 0

    obj = {}

    noop() {
      this.count = 0
    }

    noop2() {
      this.obj = {}
    }
  }

  const store = createStore(new Store())
  const subscribeSpy = vi.fn()
  const countSpy = vi.fn()
  const objSpy = vi.fn()
  store.$subscribe(subscribeSpy)
  store.$subscribe(countSpy, (s) => s.count)
  store.$subscribe(objSpy, (s) => s.obj)
  store.noop()
  expect(subscribeSpy).not.toHaveBeenCalled()
  expect(countSpy).not.toHaveBeenCalled()
  expect(objSpy).not.toHaveBeenCalled()
  store.noop2()
  expect(subscribeSpy).not.toHaveBeenCalled()
  expect(countSpy).not.toHaveBeenCalled()
  expect(objSpy).not.toHaveBeenCalled()
})

test('should warm store with state', () => {
  class Store extends TwoAndEight {
    count = 0
    greeting = 'hi'

    constructor(warmer: { count: number; greeting: string }) {
      super()
      this.count = warmer.count
      this.greeting = warmer.greeting
    }
  }

  const store = new Store({ count: 123, greeting: 'hello' })
  expect(store.count).toBe(123)
  expect(store.greeting).toBe('hello')
})

test('should update deep state', () => {
  class Store extends TwoAndEight {
    obj: { foo: { bar?: string } } = { foo: { bar: 'baz' } }
    arr = ['hello']
    str = 'hello'

    update() {
      this.obj.foo.bar = 'moo'
    }

    delete() {
      delete this.obj.foo.bar
    }

    noop() {
      //
    }

    other() {
      this.str = 'bye'
    }

    push() {
      this.arr.push('bye')
    }
  }

  const store = createStore(new Store())
  const subscribeSpy = vi.fn()
  store.$subscribe(subscribeSpy)
  expect(store.obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(store.arr).toStrictEqual(['hello'])
  store.update()
  store.noop()
  store.other()
  store.push()
  expect(subscribeSpy).toHaveBeenCalledTimes(4)
  expect(store.obj).toStrictEqual({ foo: { bar: 'moo' } })
  expect(store.arr).toStrictEqual(['hello', 'bye'])
  store.delete()
  expect(subscribeSpy).toHaveBeenCalledTimes(5)
  expect(store.obj).toStrictEqual({ foo: {} })
  expect(store.arr).toStrictEqual(['hello', 'bye'])
})
