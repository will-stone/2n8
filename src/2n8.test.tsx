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

  const { getStateByField } = createStore(new Store())

  expectTypeOf(getStateByField('count')).toMatchTypeOf<number>()

  expect(getStateByField('count')).toBe(0)

  getStateByField('buttonClicked')()

  expect(getStateByField('count')).toBe(1)

  getStateByField('asyncButtonClicked')()

  expect(getStateByField('count')).toBe(2)

  await vi.advanceTimersByTimeAsync(2999)

  expect(getStateByField('count')).toBe(2)

  await vi.advanceTimersByTimeAsync(1)

  expect(getStateByField('count')).toBe(7)
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

  const { getStateByField } = createStore(new Store())

  expect(getStateByField('count')).toBe(0)

  getStateByField('asyncButtonClicked')()

  expect(getStateByField('count')).toBe(1)

  getStateByField('buttonClicked')()

  expect(getStateByField('count')).toBe(2)

  await vi.advanceTimersByTimeAsync(3000)

  expect(getStateByField('count')).toBe(7)
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

  const { getStateByField } = createStore(new Store())

  expect(getStateByField('greeting')).toBe('hello')

  expectTypeOf(getStateByField('greeting')).toMatchTypeOf<string>()

  expect(getStateByField('count')).toBe(999)

  expectTypeOf(getStateByField('count')).toMatchTypeOf<number>()

  expect(getStateByField('toggle')).toBe(false)

  expectTypeOf(getStateByField('toggle')).toMatchTypeOf<boolean | 'a string'>()

  expect(getStateByField('untouched')).toBe(true)

  getStateByField('switched')()
  getStateByField('switched')()
  getStateByField('increment')()
  getStateByField('gone')()

  expect(getStateByField('greeting')).toBe('bye')
  expect(getStateByField('count')).toBe(1000)
  expect(getStateByField('toggle')).toBe('a string')
  expect(getStateByField('untouched')).toBe(true)

  getStateByField('resetAll')()

  expect(getStateByField('greeting')).toBe('hello')
  expect(getStateByField('count')).toBe(999)
  expect(getStateByField('toggle')).toBe(false)
  expect(getStateByField('untouched')).toBe(true)

  getStateByField('switched')()
  getStateByField('switched')()
  getStateByField('increment')()
  getStateByField('gone')()

  expect(getStateByField('greeting')).toBe('bye')
  expect(getStateByField('count')).toBe(1000)
  expect(getStateByField('toggle')).toBe('a string')
  expect(getStateByField('untouched')).toBe(true)

  getStateByField('resetAll')()

  expect(getStateByField('greeting')).toBe('hello')
  expect(getStateByField('count')).toBe(999)
  expect(getStateByField('toggle')).toBe(false)
  expect(getStateByField('untouched')).toBe(true)
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

  const { getStateByField } = createStore(new Store())
  getStateByField('resetCount')()

  expect(getStateByField('count')).toBe(999)
  expect(getStateByField('greeting')).toBe('hello')
  expect(getStateByField('untouched')).toBe(true)

  getStateByField('increment')()
  getStateByField('gone')()

  expect(getStateByField('count')).toBe(1000)
  expect(getStateByField('greeting')).toBe('bye')
  expect(getStateByField('untouched')).toBe(true)

  getStateByField('resetCount')()

  expect(getStateByField('count')).toBe(999)
  expect(getStateByField('greeting')).toBe('bye')
  expect(getStateByField('untouched')).toBe(true)

  getStateByField('increment')()

  expect(getStateByField('count')).toBe(1000)
  expect(getStateByField('greeting')).toBe('bye')
  expect(getStateByField('untouched')).toBe(true)

  getStateByField('resetCount')()

  expect(getStateByField('count')).toBe(999)
  expect(getStateByField('greeting')).toBe('bye')
  expect(getStateByField('untouched')).toBe(true)
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

  const { getStateByField } = createStore(new Store())

  expect(getStateByField('arr')).toStrictEqual([{ foo: 'bar' }])

  getStateByField('change')()

  expect(getStateByField('arr')).toStrictEqual([{ foo: 'moo' }])

  getStateByField('reset')()

  expect(getStateByField('arr')).toStrictEqual([{ foo: 'bar' }])
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

  const { getStateByField } = createStore(new Store())

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'baz' } })

  getStateByField('change')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'moo' } })

  getStateByField('reset')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'baz' } })

  getStateByField('change')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'moo' } })

  getStateByField('reset')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'baz' } })

  getStateByField('change')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'moo' } })

  getStateByField('resetObj')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'baz' } })

  getStateByField('change')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'moo' } })

  getStateByField('resetObj')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'baz' } })
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

  const { getStateByField } = createStore(new Store())

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })

  getStateByField('change')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'moo' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })

  getStateByField('reset')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })

  getStateByField('loadExternalObj')(externalObj)

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ foo: { bar: 'baz' } })

  getStateByField('change')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'moo' } })
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

  const { getStateByField } = createStore(new Store())

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })

  getStateByField('change')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'moo' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })

  getStateByField('reset')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })

  getStateByField('loadExternalObj')(externalObj)

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(externalObj).toStrictEqual({ bar: 'baz' })

  getStateByField('change')()

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'moo' } })
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

  const { getStateByField } = createStore(new Store())

  expect(getStateByField('total')).toBe(4)

  getStateByField('increaseCount')()

  expect(getStateByField('total')).toBe(5)
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

  const { getStateByField } = createStore(new Store())

  expect(() => getStateByField('resetAction')()).toThrow(
    '2n8: Cannot reset an action.',
  )
  expect(() => getStateByField('resetResetApi')()).toThrow(
    '2n8: Cannot reset an action.',
  )
  expect(() => getStateByField('resetSubscribeApi')()).toThrow(
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

  const { getStateByField, subscribe } = createStore(new Store())
  getStateByField('increaseCount')()

  expect(getStateByField('$emit')).toStrictEqual(expect.any(Function))
  expect(getStateByField('$reset')).toStrictEqual(expect.any(Function))
  expect(getStateByField('increaseCount')).toStrictEqual(expect.any(Function))
  expect(getStateByField('count')).toBe(1)
  expect(getStateByField('untouched')).toBe('foo')
  expect(subscribe).toStrictEqual(expect.any(Function))
  expect(getStateByField('derived')).toBe(11)

  expectTypeOf(getStateByField('count')).toMatchTypeOf<number>()
  expectTypeOf(getStateByField('untouched')).toMatchTypeOf<string>()
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

  const { getStateByField, subscribe } = createStore(new Store())
  const subscribeSpy = vi.fn<() => void>()
  subscribe(subscribeSpy)
  getStateByField('noop')()

  expect(subscribeSpy).toHaveBeenCalledOnce()

  getStateByField('noop2')()

  expect(subscribeSpy).toHaveBeenCalledTimes(2)
})

test('should unsubscribe', () => {
  class Store extends TwoAndEight {
    count = 0

    increaseCount = () => {
      this.count++
    }
  }

  const { getStateByField, subscribe } = createStore(new Store())
  const spy = vi.fn<() => void>()
  const unsubscribe = subscribe(spy)
  getStateByField('increaseCount')()

  expect(spy).toHaveBeenCalledOnce()

  unsubscribe()
  getStateByField('increaseCount')()
  getStateByField('increaseCount')()
  getStateByField('increaseCount')()

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

  const { getStateByField, subscribe } = createStore(new Store())
  const subscribeSpy = vi.fn<() => void>()
  subscribe(subscribeSpy)

  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'baz' } })
  expect(getStateByField('arr')).toStrictEqual(['hello'])

  getStateByField('update')()
  getStateByField('noop')()
  getStateByField('other')()
  getStateByField('push')()

  expect(subscribeSpy).toHaveBeenCalledTimes(4)
  expect(getStateByField('obj')).toStrictEqual({ foo: { bar: 'moo' } })
  expect(getStateByField('arr')).toStrictEqual(['hello', 'bye'])

  getStateByField('delete')()

  expect(subscribeSpy).toHaveBeenCalledTimes(5)
  expect(getStateByField('obj')).toStrictEqual({ foo: {} })
  expect(getStateByField('arr')).toStrictEqual(['hello', 'bye'])
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

  const { getStateByField, subscribe } = createStore(new Store())
  const subscribeSpy = vi.fn<() => void>()
  subscribe(subscribeSpy)
  getStateByField('increment')()

  expect(subscribeSpy).toHaveBeenCalledOnce()

  getStateByField('resetCount')()

  expect(getStateByField('count')).toBe(3)
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
