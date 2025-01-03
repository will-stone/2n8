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
      this.$emit()
      await new Promise((res) => {
        setTimeout(res, 3000)
      })
      this.count = this.count + 5
    }
  }

  const store = createStore(new Store())
  expectTypeOf(store.getState().count).toMatchTypeOf<number>()
  expect(store.getState().count).toBe(0)
  store.getState().buttonClicked()
  expect(store.getState().count).toBe(1)
  store.getState().asyncButtonClicked()
  expect(store.getState().count).toBe(2)
  await vi.advanceTimersByTimeAsync(2999)
  expect(store.getState().count).toBe(2)
  await vi.advanceTimersByTimeAsync(1)
  expect(store.getState().count).toBe(7)
})

test('should always return master record', async () => {
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

  const store = createStore(new Store())
  expect(store.getState().count).toBe(0)
  store.getState().asyncButtonClicked()
  expect(store.getState().count).toBe(1)
  store.getState().buttonClicked()
  expect(store.getState().count).toBe(2)
  await vi.advanceTimersByTimeAsync(3000)
  expect(store.getState().count).toBe(7)
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

  expect(store.getState().greeting).toBe('hello')
  expectTypeOf(store.getState().greeting).toMatchTypeOf<string>()
  expect(store.getState().count).toBe(999)
  expectTypeOf(store.getState().count).toMatchTypeOf<number>()
  expect(store.getState().toggle).toBe(false)
  expectTypeOf(store.getState().toggle).toMatchTypeOf<boolean | 'a string'>()
  expect(store.getState().untouched).toBe(true)

  store.getState().switched()
  store.getState().switched()
  store.getState().increment()
  store.getState().gone()

  expect(store.getState().greeting).toBe('bye')
  expect(store.getState().count).toBe(1000)
  expect(store.getState().toggle).toBe('a string')
  expect(store.getState().untouched).toBe(true)

  store.getState().resetAll()

  expect(store.getState().greeting).toBe('hello')
  expect(store.getState().count).toBe(999)
  expect(store.getState().toggle).toBe(false)
  expect(store.getState().untouched).toBe(true)

  store.getState().switched()
  store.getState().switched()
  store.getState().increment()
  store.getState().gone()

  expect(store.getState().greeting).toBe('bye')
  expect(store.getState().count).toBe(1000)
  expect(store.getState().toggle).toBe('a string')
  expect(store.getState().untouched).toBe(true)

  store.getState().resetAll()

  expect(store.getState().greeting).toBe('hello')
  expect(store.getState().count).toBe(999)
  expect(store.getState().toggle).toBe(false)
  expect(store.getState().untouched).toBe(true)
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
  store.getState().resetCount()
  expect(store.getState().count).toBe(999)
  expect(store.getState().greeting).toBe('hello')
  expect(store.getState().untouched).toBe(true)
  store.getState().increment()
  store.getState().gone()
  expect(store.getState().count).toBe(1000)
  expect(store.getState().greeting).toBe('bye')
  expect(store.getState().untouched).toBe(true)
  store.getState().resetCount()
  expect(store.getState().count).toBe(999)
  expect(store.getState().greeting).toBe('bye')
  expect(store.getState().untouched).toBe(true)
  store.getState().increment()
  expect(store.getState().count).toBe(1000)
  expect(store.getState().greeting).toBe('bye')
  expect(store.getState().untouched).toBe(true)
  store.getState().resetCount()
  expect(store.getState().count).toBe(999)
  expect(store.getState().greeting).toBe('bye')
  expect(store.getState().untouched).toBe(true)
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
  expect(store.getState().arr).toStrictEqual([{ foo: 'bar' }])
  store.getState().change()
  expect(store.getState().arr).toStrictEqual([{ foo: 'moo' }])
  store.getState().reset()
  expect(store.getState().arr).toStrictEqual([{ foo: 'bar' }])
})

test('should not mutate external objects', () => {
  const externalObj = {
    foo: {
      bar: 'baz',
    },
  }

  class Store extends TwoAndEight {
    obj = externalObj

    loadExternalObj(ext: { foo: { bar: string } }) {
      this.obj = ext
    }

    change() {
      this.obj.foo.bar = 'moo'
    }

    reset() {
      this.$reset()
    }
  }

  const store = createStore(new Store())
  expect(store.getState().obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })
  store.getState().change()
  expect(store.getState().obj).toStrictEqual({ foo: { bar: 'moo' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })
  store.getState().reset()
  expect(store.getState().obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })
  store.getState().loadExternalObj(externalObj)
  expect(store.getState().obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })
  store.getState().change()
  expect(store.getState().obj).toStrictEqual({ foo: { bar: 'moo' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })
})

test('should not mutate external objects in nested object state', () => {
  const externalObj = { bar: 'baz' }

  class Store extends TwoAndEight {
    obj = { foo: externalObj }

    loadExternalObj(ext: { bar: string }) {
      this.obj.foo = ext
    }

    change() {
      this.obj.foo.bar = 'moo'
    }

    reset() {
      this.$reset()
    }
  }

  const store = createStore(new Store())
  expect(store.getState().obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })
  store.getState().change()
  expect(store.getState().obj).toStrictEqual({ foo: { bar: 'moo' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })
  store.getState().reset()
  expect(store.getState().obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })
  store.getState().loadExternalObj(externalObj)
  expect(store.getState().obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })
  store.getState().change()
  expect(store.getState().obj).toStrictEqual({ foo: { bar: 'moo' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })
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
  expect(store.getState().total).toBe(4)
  store.getState().increaseCount()
  expect(store.getState().total).toBe(5)
})

test('should throw if attempting to reset an action', () => {
  class Store extends TwoAndEight {
    count = 0

    increaseCount() {
      this.count = this.count + 1
    }

    resetAction() {
      this.$reset('increaseCount')
    }

    resetResetApi() {
      this.$reset('$reset')
    }

    resetSubscribeApi() {
      this.$reset('$emit')
    }
  }

  const store = createStore(new Store())
  expect(() => store.getState().resetAction()).toThrow(
    '2n8: Cannot reset an action.',
  )
  expect(() => store.getState().resetResetApi()).toThrow(
    '2n8: Cannot reset an action.',
  )
  expect(() => store.getState().resetSubscribeApi()).toThrow(
    '2n8: Cannot reset an action.',
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
  store.getState().increaseCount()
  expect(store.getInitialState()).toStrictEqual({
    $emit: expect.any(Function),
    $reset: expect.any(Function),
    count: 0,
    increaseCount: expect.any(Function),
    untouched: 'foo',
  })
  expectTypeOf(store.getInitialState().count).toMatchTypeOf<number>()
  expectTypeOf(store.getInitialState().untouched).toMatchTypeOf<string>()
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
  store.getState().increaseCount()
  expect(store.getState()).toStrictEqual({
    $emit: expect.any(Function),
    $reset: expect.any(Function),
    count: 1,
    derived: 11,
    increaseCount: expect.any(Function),
    untouched: 'foo',
  })
  expectTypeOf(store.getState().count).toMatchTypeOf<number>()
  expectTypeOf(store.getState().untouched).toMatchTypeOf<string>()
})

test('should allow granular subscriptions', () => {
  class Store extends TwoAndEight {
    count = 0
    untouched = 'foo'

    increaseCount() {
      this.count = this.count + 1
    }
  }

  const store = createStore(new Store())
  expectTypeOf(store.subscribe).toMatchTypeOf<
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
  store.subscribe(countSpy, (s) => s.count)
  store.subscribe(untouchedSpy, (s) => s.untouched)
  store.getState().increaseCount()
  expect(countSpy).toHaveBeenCalledOnce()
  expect(untouchedSpy).not.toHaveBeenCalled()
})

test('should allow granular subscriptions to derived state', () => {
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
  store.subscribe(derivedSpy, (s) => s.derived)
  store.getState().increaseCount()
  expect(derivedSpy).toHaveBeenCalledOnce()
})

test('should not call subscriber when state has not changed', () => {
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
  store.subscribe(subscribeSpy)
  store.subscribe(countSpy, (s) => s.count)
  store.subscribe(objSpy, (s) => s.obj)
  store.getState().noop()
  expect(subscribeSpy).toHaveBeenCalledOnce()
  expect(countSpy).not.toHaveBeenCalled()
  expect(objSpy).not.toHaveBeenCalled()
  store.getState().noop2()
  expect(subscribeSpy).toHaveBeenCalledTimes(2)
  expect(countSpy).not.toHaveBeenCalled()
  expect(objSpy).not.toHaveBeenCalled()
})

test('should unsubscribe', () => {
  class Store extends TwoAndEight {
    count = 0

    increaseCount() {
      this.count = this.count + 1
    }
  }

  const store = createStore(new Store())
  const spy = vi.fn()
  const unsubscribe = store.subscribe(spy)
  store.getState().increaseCount()
  expect(spy).toHaveBeenCalledOnce()
  unsubscribe()
  store.getState().increaseCount()
  store.getState().increaseCount()
  store.getState().increaseCount()
  expect(spy).toHaveBeenCalledOnce()
})

test('should unsubscribe from allow granular subscriptions', () => {
  class Store extends TwoAndEight {
    count = 0
    count2 = 0

    increaseCount() {
      this.count = this.count + 1
    }

    increaseCount2() {
      this.count2 = this.count2 + 1
    }
  }

  const store = createStore(new Store())
  const countSpy = vi.fn()
  const count2Spy = vi.fn()
  const unsubscribe = store.subscribe(countSpy, (s) => s.count)
  store.subscribe(count2Spy, (s) => s.count2)
  expect(store.getSubscribersCount()).toBe(2)
  store.getState().increaseCount()
  expect(countSpy).toHaveBeenCalledOnce()
  expect(count2Spy).not.toHaveBeenCalled()
  store.getState().increaseCount2()
  expect(countSpy).toHaveBeenCalledOnce()
  expect(count2Spy).toHaveBeenCalledOnce()
  unsubscribe()
  expect(store.getSubscribersCount()).toBe(1)
  store.getState().increaseCount()
  store.getState().increaseCount2()
  expect(countSpy).toHaveBeenCalledOnce()
  expect(count2Spy).toHaveBeenCalledTimes(2)
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
  store.subscribe(subscribeSpy)
  expect(store.getState().obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(store.getState().arr).toStrictEqual(['hello'])
  store.getState().update()
  store.getState().noop()
  store.getState().other()
  store.getState().push()
  expect(subscribeSpy).toHaveBeenCalledTimes(4)
  expect(store.getState().obj).toStrictEqual({ foo: { bar: 'moo' } })
  expect(store.getState().arr).toStrictEqual(['hello', 'bye'])
  store.getState().delete()
  expect(subscribeSpy).toHaveBeenCalledTimes(5)
  expect(store.getState().obj).toStrictEqual({ foo: {} })
  expect(store.getState().arr).toStrictEqual(['hello', 'bye'])
})

test('should not fire subscription until end of action', () => {
  class Store extends TwoAndEight {
    count = 999

    increment() {
      this.count = this.count + 1
    }

    resetCount() {
      this.$reset('count')
      this.count = 10
      this.$reset('count')
      this.count = 3
    }
  }

  const store = createStore(new Store())
  const countSpy = vi.fn()
  store.subscribe(countSpy, (s) => s.count)
  store.getState().increment()
  expect(countSpy).toHaveBeenCalledOnce()
  store.getState().resetCount()
  expect(store.getState().count).toBe(3)
  expect(countSpy).toHaveBeenCalledTimes(2)
})

test("should fail types when store hasn't extended super class", () => {
  class Store {
    count = 0
  }

  // @ts-expect-error -- this should error, if this line is marked as an error then we know it's not typed correctly.
  createStore(new Store())

  expect.assertions(0)
})
