import { afterEach, beforeEach, expect, expectTypeOf, test, vi } from 'vitest'

import { createStore, TwoAndEight } from './2n8.js'
import { clone } from './clone.js'

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
  expect(store.count).toBe(0)
  store.asyncButtonClicked()
  expect(store.count).toBe(1)
  store.buttonClicked()
  expect(store.count).toBe(2)
  await vi.advanceTimersByTimeAsync(3000)
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

  store.resetAll()

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
  store.resetCount()
  expect(store.count).toBe(999)
  expect(store.greeting).toBe('hello')
  expect(store.untouched).toBe(true)
  store.increment()
  store.gone()
  expect(store.count).toBe(1000)
  expect(store.greeting).toBe('bye')
  expect(store.untouched).toBe(true)
  store.resetCount()
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

test('should not mutate initial state on reset', () => {
  class Store extends TwoAndEight {
    obj = {
      foo: {
        bar: 'baz',
      },
    }

    change() {
      this.obj.foo.bar = 'moo'
    }

    reset() {
      this.$reset()
    }

    resetObj() {
      this.$reset('obj')
    }
  }

  const store = createStore(new Store())
  expect(store.obj).toStrictEqual({ foo: { bar: 'baz' } })
  store.change()
  expect(store.obj).toStrictEqual({ foo: { bar: 'moo' } })
  store.reset()
  expect(store.obj).toStrictEqual({ foo: { bar: 'baz' } })
  store.change()
  expect(store.obj).toStrictEqual({ foo: { bar: 'moo' } })
  store.reset()
  expect(store.obj).toStrictEqual({ foo: { bar: 'baz' } })
  store.change()
  expect(store.obj).toStrictEqual({ foo: { bar: 'moo' } })
  store.resetObj()
  expect(store.obj).toStrictEqual({ foo: { bar: 'baz' } })
  store.change()
  expect(store.obj).toStrictEqual({ foo: { bar: 'moo' } })
  store.resetObj()
  expect(store.obj).toStrictEqual({ foo: { bar: 'baz' } })
})

test('should not mutate external objects when cloned', () => {
  const externalObj = {
    foo: {
      bar: 'baz',
    },
  }

  class Store extends TwoAndEight {
    obj = externalObj

    loadExternalObj(ext: { foo: { bar: string } }) {
      this.obj = clone(ext)
    }

    change() {
      this.obj.foo.bar = 'moo'
    }

    reset() {
      this.$reset()
    }
  }

  const store = createStore(new Store())
  expect(store.obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })
  store.change()
  expect(store.obj).toStrictEqual({ foo: { bar: 'moo' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })
  store.reset()
  expect(store.obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })
  store.loadExternalObj(externalObj)
  expect(store.obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })
  store.change()
  expect(store.obj).toStrictEqual({ foo: { bar: 'moo' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })
})

test('should not mutate external objects in nested object state when cloned', () => {
  const externalObj = { bar: 'baz' }

  class Store extends TwoAndEight {
    obj = { foo: externalObj }

    loadExternalObj(ext: { bar: string }) {
      this.obj.foo = clone(ext)
    }

    change() {
      this.obj.foo.bar = 'moo'
    }

    reset() {
      this.$reset()
    }
  }

  const store = createStore(new Store())
  expect(store.obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })
  store.change()
  expect(store.obj).toStrictEqual({ foo: { bar: 'moo' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })
  store.reset()
  expect(store.obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })
  store.loadExternalObj(externalObj)
  expect(store.obj).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })
  store.change()
  expect(store.obj).toStrictEqual({ foo: { bar: 'moo' } })
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
  expect(() => store.resetAction()).toThrow('2n8: Cannot reset an action.')
  expect(() => store.resetResetApi()).toThrow('2n8: Cannot reset an action.')
  expect(() => store.resetSubscribeApi()).toThrow(
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
  expect(clone(store)).toStrictEqual({
    $emit: expect.any(Function),
    $getInitialState: expect.any(Function),
    $getSubscribersCount: expect.any(Function),
    $reset: expect.any(Function),
    $subscribe: expect.any(Function),
    count: 1,
    increaseCount: expect.any(Function),
    untouched: 'foo',
  })
  expect(store.derived).toBe(11)
  expectTypeOf(store.count).toMatchTypeOf<number>()
  expectTypeOf(store.untouched).toMatchTypeOf<string>()
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
  store.$subscribe(subscribeSpy)
  store.noop()
  expect(subscribeSpy).toHaveBeenCalledOnce()
  store.noop2()
  expect(subscribeSpy).toHaveBeenCalledTimes(2)
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
  const unsubscribe = store.$subscribe(spy)
  store.increaseCount()
  expect(spy).toHaveBeenCalledOnce()
  unsubscribe()
  store.increaseCount()
  store.increaseCount()
  store.increaseCount()
  expect(spy).toHaveBeenCalledOnce()
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
  const subscribeSpy = vi.fn()
  store.$subscribe(subscribeSpy)
  store.increment()
  expect(subscribeSpy).toHaveBeenCalledOnce()
  store.resetCount()
  expect(store.count).toBe(3)
  expect(subscribeSpy).toHaveBeenCalledTimes(2)
})

test("should fail types when store hasn't extended super class", () => {
  class Store {
    count = 0
  }

  // @ts-expect-error -- this should error, if this line is marked as an error then we know it's not typed correctly.
  createStore(new Store())

  expect.assertions(0)
})
