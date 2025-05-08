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

    buttonClicked = () => {
      this.count++
    }

    asyncButtonClicked = async () => {
      this.count++
      this.$emit()
      await new Promise((res) => {
        setTimeout(res, 3000)
      })
      this.count = this.count + 5
    }
  }

  const { get } = createStore(new Store())

  expectTypeOf(get('count')).toMatchTypeOf<number>()

  expect(get('count')).toBe(0)

  get('buttonClicked')()

  expect(get('count')).toBe(1)

  get('asyncButtonClicked')()

  expect(get('count')).toBe(2)

  await vi.advanceTimersByTimeAsync(2999)

  expect(get('count')).toBe(2)

  await vi.advanceTimersByTimeAsync(1)

  expect(get('count')).toBe(7)
})

test('should always return master record', async () => {
  class Store extends TwoAndEight {
    count = 0

    buttonClicked = () => {
      this.count++
    }

    asyncButtonClicked = async () => {
      this.count++
      await new Promise((res) => {
        setTimeout(res, 3000)
      })
      this.count = this.count + 5
    }
  }

  const { get } = createStore(new Store())

  expect(get('count')).toBe(0)

  get('asyncButtonClicked')()

  expect(get('count')).toBe(1)

  get('buttonClicked')()

  expect(get('count')).toBe(2)

  await vi.advanceTimersByTimeAsync(3000)

  expect(get('count')).toBe(7)
})

test('should reset all state', () => {
  class Store extends TwoAndEight {
    untouched = true
    toggle: boolean | 'a string' = false
    greeting = 'hello'
    count = 999

    increment = () => {
      this.count++
    }

    gone = () => {
      this.greeting = 'bye'
    }

    switched = () => {
      if (this.toggle === true) {
        this.toggle = 'a string'
      } else if (this.toggle === false) {
        this.toggle = true
      } else {
        this.toggle = false
      }
    }

    resetAll = () => {
      this.$reset()
    }
  }

  const { get } = createStore(new Store())

  expect(get('greeting')).toBe('hello')

  expectTypeOf(get('greeting')).toMatchTypeOf<string>()

  expect(get('count')).toBe(999)

  expectTypeOf(get('count')).toMatchTypeOf<number>()

  expect(get('toggle')).toBe(false)

  expectTypeOf(get('toggle')).toMatchTypeOf<boolean | 'a string'>()

  expect(get('untouched')).toBe(true)

  get('switched')()
  get('switched')()
  get('increment')()
  get('gone')()

  expect(get('greeting')).toBe('bye')
  expect(get('count')).toBe(1000)
  expect(get('toggle')).toBe('a string')
  expect(get('untouched')).toBe(true)

  get('resetAll')()

  expect(get('greeting')).toBe('hello')
  expect(get('count')).toBe(999)
  expect(get('toggle')).toBe(false)
  expect(get('untouched')).toBe(true)

  get('switched')()
  get('switched')()
  get('increment')()
  get('gone')()

  expect(get('greeting')).toBe('bye')
  expect(get('count')).toBe(1000)
  expect(get('toggle')).toBe('a string')
  expect(get('untouched')).toBe(true)

  get('resetAll')()

  expect(get('greeting')).toBe('hello')
  expect(get('count')).toBe(999)
  expect(get('toggle')).toBe(false)
  expect(get('untouched')).toBe(true)
})

test('should reset single field', () => {
  class Store extends TwoAndEight {
    untouched = true
    greeting = 'hello'
    count = 999

    increment = () => {
      this.count++
    }

    gone = () => {
      this.greeting = 'bye'
    }

    resetCount = () => {
      this.$reset('count')
    }
  }

  const { get } = createStore(new Store())
  get('resetCount')()

  expect(get('count')).toBe(999)
  expect(get('greeting')).toBe('hello')
  expect(get('untouched')).toBe(true)

  get('increment')()
  get('gone')()

  expect(get('count')).toBe(1000)
  expect(get('greeting')).toBe('bye')
  expect(get('untouched')).toBe(true)

  get('resetCount')()

  expect(get('count')).toBe(999)
  expect(get('greeting')).toBe('bye')
  expect(get('untouched')).toBe(true)

  get('increment')()

  expect(get('count')).toBe(1000)
  expect(get('greeting')).toBe('bye')
  expect(get('untouched')).toBe(true)

  get('resetCount')()

  expect(get('count')).toBe(999)
  expect(get('greeting')).toBe('bye')
  expect(get('untouched')).toBe(true)
})

test('should reset complex state', () => {
  class Store extends TwoAndEight {
    arr = [{ foo: 'bar' }]

    change = () => {
      this.arr[0].foo = 'moo'
    }

    reset = () => {
      this.$reset('arr')
    }
  }

  const { get } = createStore(new Store())

  expect(get('arr')).toStrictEqual([{ foo: 'bar' }])

  get('change')()

  expect(get('arr')).toStrictEqual([{ foo: 'moo' }])

  get('reset')()

  expect(get('arr')).toStrictEqual([{ foo: 'bar' }])
})

test('should not mutate initial state on reset', () => {
  class Store extends TwoAndEight {
    obj = {
      foo: {
        bar: 'baz',
      },
    }

    change = () => {
      this.obj.foo.bar = 'moo'
    }

    reset = () => {
      this.$reset()
    }

    resetObj = () => {
      this.$reset('obj')
    }
  }

  const { get } = createStore(new Store())

  expect(get('obj')).toStrictEqual({ foo: { bar: 'baz' } })

  get('change')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'moo' } })

  get('reset')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'baz' } })

  get('change')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'moo' } })

  get('reset')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'baz' } })

  get('change')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'moo' } })

  get('resetObj')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'baz' } })

  get('change')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'moo' } })

  get('resetObj')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'baz' } })
})

test('should not mutate external objects when cloned', () => {
  const externalObj = {
    foo: {
      bar: 'baz',
    },
  }

  class Store extends TwoAndEight {
    obj = externalObj

    loadExternalObj = (ext: { foo: { bar: string } }) => {
      this.obj = structuredClone(ext)
    }

    change = () => {
      this.obj.foo.bar = 'moo'
    }

    reset = () => {
      this.$reset()
    }
  }

  const { get } = createStore(new Store())

  expect(get('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })

  get('change')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'moo' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })

  get('reset')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })

  get('loadExternalObj')(externalObj)

  expect(get('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })

  get('change')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'moo' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })
})

test('should not mutate external objects in nested object state when cloned', () => {
  const externalObj = { bar: 'baz' }

  class Store extends TwoAndEight {
    obj = { foo: externalObj }

    loadExternalObj = (ext: { bar: string }) => {
      this.obj.foo = structuredClone(ext)
    }

    change = () => {
      this.obj.foo.bar = 'moo'
    }

    reset = () => {
      this.$reset()
    }
  }

  const { get } = createStore(new Store())

  expect(get('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })

  get('change')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'moo' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })

  get('reset')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })

  get('loadExternalObj')(externalObj)

  expect(get('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })

  get('change')()

  expect(get('obj')).toStrictEqual({ foo: { bar: 'moo' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })
})

test('should compute derived value', () => {
  class Store extends TwoAndEight {
    count = 1
    count2 = 3

    get total() {
      return this.count + this.count2
    }

    increaseCount = () => {
      this.count++
    }
  }

  const { get } = createStore(new Store())

  expect(get('total')).toBe(4)

  get('increaseCount')()

  expect(get('total')).toBe(5)
})

test('should throw if attempting to reset an action', () => {
  class Store extends TwoAndEight {
    count = 0

    increaseCount = () => {
      this.count++
    }

    resetAction = () => {
      this.$reset('increaseCount')
    }

    resetResetApi = () => {
      this.$reset('$reset')
    }

    resetSubscribeApi = () => {
      this.$reset('$emit')
    }
  }

  const { get } = createStore(new Store())

  expect(() => get('resetAction')()).toThrow('2n8: Cannot reset an action.')
  expect(() => get('resetResetApi')()).toThrow('2n8: Cannot reset an action.')
  expect(() => get('resetSubscribeApi')()).toThrow(
    '2n8: Cannot reset an action.',
  )
})

test('should return current state', () => {
  class Store extends TwoAndEight {
    count = 0
    untouched = 'foo'

    get derived() {
      return this.count + 10
    }

    increaseCount = () => {
      this.count++
    }
  }

  const { get, subscribe } = createStore(new Store())
  get('increaseCount')()

  expect(get('$emit')).toStrictEqual(expect.any(Function))
  expect(get('$reset')).toStrictEqual(expect.any(Function))
  expect(get('increaseCount')).toStrictEqual(expect.any(Function))
  expect(get('count')).toBe(1)
  expect(get('untouched')).toBe('foo')
  expect(subscribe).toStrictEqual(expect.any(Function))
  expect(get('derived')).toBe(11)

  expectTypeOf(get('count')).toMatchTypeOf<number>()
  expectTypeOf(get('untouched')).toMatchTypeOf<string>()
})

test('should not call subscriber when state has not changed', () => {
  class Store extends TwoAndEight {
    count = 0

    obj = {}

    noop = () => {
      this.count = 0
    }

    noop2 = () => {
      this.obj = {}
    }
  }

  const { get, subscribe } = createStore(new Store())
  const subscribeSpy = vi.fn<() => void>()
  subscribe(subscribeSpy)
  get('noop')()

  expect(subscribeSpy).toHaveBeenCalledOnce()

  get('noop2')()

  expect(subscribeSpy).toHaveBeenCalledTimes(2)
})

test('should unsubscribe', () => {
  class Store extends TwoAndEight {
    count = 0

    increaseCount = () => {
      this.count++
    }
  }

  const { get, subscribe } = createStore(new Store())
  const spy = vi.fn<() => void>()
  const unsubscribe = subscribe(spy)
  get('increaseCount')()

  expect(spy).toHaveBeenCalledOnce()

  unsubscribe()
  get('increaseCount')()
  get('increaseCount')()
  get('increaseCount')()

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

    update = () => {
      this.obj.foo.bar = 'moo'
    }

    delete = () => {
      delete this.obj.foo.bar
    }

    noop = () => {
      //
    }

    other = () => {
      this.str = 'bye'
    }

    push = () => {
      this.arr.push('bye')
    }
  }

  const { get, subscribe } = createStore(new Store())
  const subscribeSpy = vi.fn<() => void>()
  subscribe(subscribeSpy)

  expect(get('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(get('arr')).toStrictEqual(['hello'])

  get('update')()
  get('noop')()
  get('other')()
  get('push')()

  expect(subscribeSpy).toHaveBeenCalledTimes(4)
  expect(get('obj')).toStrictEqual({ foo: { bar: 'moo' } })
  expect(get('arr')).toStrictEqual(['hello', 'bye'])

  get('delete')()

  expect(subscribeSpy).toHaveBeenCalledTimes(5)
  expect(get('obj')).toStrictEqual({ foo: {} })
  expect(get('arr')).toStrictEqual(['hello', 'bye'])
})

test('should not fire subscription until end of action', () => {
  class Store extends TwoAndEight {
    count = 999

    increment = () => {
      this.count++
    }

    resetCount = () => {
      this.$reset('count')
      this.count = 10
      this.$reset('count')
      this.count = 3
    }
  }

  const { get, subscribe } = createStore(new Store())
  const subscribeSpy = vi.fn<() => void>()
  subscribe(subscribeSpy)
  get('increment')()

  expect(subscribeSpy).toHaveBeenCalledOnce()

  get('resetCount')()

  expect(get('count')).toBe(3)
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
