import { render, renderHook, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import type { FC } from 'react'
import { useRef } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { createBaseStore, createStore, id } from './pickle.js'

const RenderCount: FC<{ readonly title: string }> = ({ title }) => {
  const renderCount = useRef(0)

  renderCount.current = renderCount.current + 1

  return (
    <div>
      {title} component: {renderCount.current}
    </div>
  )
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

test('should set state on base store', () => {
  const subSpy = vi.fn<() => void>()

  const { dispatch, getState } = createBaseStore({
    initialState: {
      count: 1,
      obj: id<{ a: 'b'; c: 'd' | 'z' }>({ a: 'b', c: 'd' }),
    },

    events: ({ set, get, reset }) => ({
      getter() {
        const currentState = get().count
        // eslint-disable-next-line no-console
        console.log(currentState)
      },
      resetter() {
        reset('count')
      },
      setObjB() {
        set((s) => {
          s.obj.c = 'z'
        })
      },
      setter() {
        set((s) => {
          s.count++
        })
      },
      withPayload(num: number) {
        set((s) => {
          s.count = num
        })
      },
    }),

    subscriptions: [[(s) => [s.count, s.obj.a], subSpy]],
  })

  expect(getState().count).toBe(1)

  dispatch('setter')

  expect(getState().count).toBe(2)
  expect(subSpy).toHaveBeenCalledOnce()

  dispatch('resetter')

  expect(getState().count).toBe(1)
  expect(subSpy).toHaveBeenCalledTimes(2)

  dispatch('setObjB')

  expect(getState().count).toBe(1)
  expect(getState().obj.c).toBe('z')

  expect(subSpy).toHaveBeenCalledTimes(2)
})

test('should set, get, and reset state', () => {
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => null)

  const { useStore, useDispatch } = createStore({
    initialState: {
      count: 1,
    },

    events: ({ set, get, reset }) => ({
      getter() {
        const currentState = get().count
        // eslint-disable-next-line no-console
        console.log(currentState)
      },
      resetter() {
        reset('count')
      },
      setter() {
        set((s) => {
          s.count++
        })
      },
      withPayload(num: number) {
        set((s) => {
          s.count = num
        })
      },
    }),
  })

  const { result: count, rerender } = renderHook(() => useStore('count'))
  const { result: setter } = renderHook(() => useDispatch('setter'))
  const { result: getter } = renderHook(() => useDispatch('getter'))
  const { result: resetter } = renderHook(() => useDispatch('resetter'))
  const { result: withPayload } = renderHook(() => useDispatch('withPayload'))

  getter.current()

  expect(logSpy).toHaveBeenNthCalledWith(1, 1)
  expect(count.current).toBe(1)

  setter.current()
  rerender()

  expect(count.current).toBe(2)

  getter.current()
  rerender()

  expect(logSpy).toHaveBeenNthCalledWith(2, 2)
  expect(count.current).toBe(2)

  resetter.current()
  rerender()
  getter.current()

  expect(logSpy).toHaveBeenNthCalledWith(3, 1)
  expect(count.current).toBe(1)

  withPayload.current(99)
  rerender()
  getter.current()

  expect(logSpy).toHaveBeenNthCalledWith(4, 99)
  expect(count.current).toBe(99)
})

test('should update count component and not rerender others', async () => {
  const { useStore, useSelector, useDispatch } = createStore({
    initialState: {
      count: 0,
      count2: 4,
      obj: {
        a: 1,
        b: 99,
      },
    },

    events: ({ set }) => ({
      async asyncButtonClicked() {
        set((state) => {
          state.count = state.count + 1
        })
        await new Promise((res) => {
          setTimeout(res, 10_000)
        })
        set((state) => {
          state.count = state.count + 5
        })
      },
      buttonClicked() {
        set((state) => {
          state.count = state.count + 1
        })
      },
      objButtonClicked() {
        set((s) => {
          s.obj.a++
        })
      },
    }),

    selectors: {
      derived(state) {
        return state.count + 10
      },
      derived2(state) {
        return state.count2 + 1
      },
      derived3(state) {
        return state.obj.a
      },
      derived4(state) {
        return state.obj.b
      },
    },
  })

  const Count: FC = () => {
    const count = useStore('count')
    return (
      <div>
        <div>Count: {count}</div>
        <RenderCount title="Count" />
      </div>
    )
  }

  const Derived: FC = () => {
    const derived = useSelector('derived')
    return (
      <div>
        <div>Derived: {derived}</div>
        <RenderCount title="Derived" />
      </div>
    )
  }

  const Derived2: FC = () => {
    const derived2 = useSelector('derived2')
    return (
      <div>
        <div>Derived2: {derived2}</div>
        <RenderCount title="Derived2" />
      </div>
    )
  }

  const Derived3: FC = () => {
    const derived3 = useSelector('derived3')
    return (
      <div>
        <div>Derived3: {derived3}</div>
        <RenderCount title="Derived3" />
      </div>
    )
  }

  const Derived4: FC = () => {
    const derived4 = useSelector('derived4')
    return (
      <div>
        <div>Derived4: {derived4}</div>
        <RenderCount title="Derived4" />
      </div>
    )
  }

  const Button: FC = () => {
    const buttonClicked = useDispatch('buttonClicked')
    return (
      <div>
        <button onClick={buttonClicked} type="button">
          Button
        </button>
        <RenderCount title="Button" />
      </div>
    )
  }

  const AsyncButton: FC = () => {
    const asyncButtonClicked = useDispatch('asyncButtonClicked')
    return (
      <div>
        <button onClick={asyncButtonClicked} type="button">
          AsyncButton
        </button>
        <RenderCount title="AsyncButton" />
      </div>
    )
  }

  const ObjButton: FC = () => {
    const objButtonClicked = useDispatch('objButtonClicked')
    return (
      <div>
        <button onClick={objButtonClicked} type="button">
          ObjButton
        </button>
      </div>
    )
  }

  const App = () => {
    return (
      <>
        <Button />
        <AsyncButton />
        <ObjButton />
        <Count />
        <Derived />
        <Derived2 />
        <Derived3 />
        <Derived4 />
        <RenderCount title="App" />
      </>
    )
  }

  const user = userEvent.setup()
  render(<App />)

  expect(screen.getByText('App component: 1')).toBeVisible()
  expect(screen.getByText('Count component: 1')).toBeVisible()
  expect(screen.getByText('Count: 0')).toBeVisible()
  expect(screen.getByText('Derived component: 1')).toBeVisible()
  expect(screen.getByText('Derived: 10')).toBeVisible()
  expect(screen.getByText('Derived2 component: 1')).toBeVisible()
  expect(screen.getByText('Derived2: 5')).toBeVisible()
  expect(screen.getByText('Derived3 component: 1')).toBeVisible()
  expect(screen.getByText('Derived3: 1')).toBeVisible()
  expect(screen.getByText('Derived4 component: 1')).toBeVisible()
  expect(screen.getByText('Derived4: 99')).toBeVisible()
  expect(screen.getByText('Button component: 1')).toBeVisible()
  expect(screen.getByText('AsyncButton component: 1')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Button' }))

  expect(screen.getByText('App component: 1')).toBeVisible()
  expect(screen.getByText('Count component: 2')).toBeVisible()
  expect(screen.getByText('Count: 1')).toBeVisible()
  expect(screen.getByText('Derived component: 2')).toBeVisible()
  expect(screen.getByText('Derived: 11')).toBeVisible()
  expect(screen.getByText('Derived2 component: 1')).toBeVisible()
  expect(screen.getByText('Derived2: 5')).toBeVisible()
  expect(screen.getByText('Button component: 1')).toBeVisible()
  expect(screen.getByText('AsyncButton component: 1')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Button' }))

  expect(screen.getByText('App component: 1')).toBeVisible()
  expect(screen.getByText('Count component: 3')).toBeVisible()
  expect(screen.getByText('Count: 2')).toBeVisible()
  expect(screen.getByText('Derived component: 3')).toBeVisible()
  expect(screen.getByText('Derived: 12')).toBeVisible()
  expect(screen.getByText('Derived2 component: 1')).toBeVisible()
  expect(screen.getByText('Derived2: 5')).toBeVisible()
  expect(screen.getByText('Button component: 1')).toBeVisible()
  expect(screen.getByText('AsyncButton component: 1')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'AsyncButton' }))

  expect(screen.getByText('Count: 3')).toBeVisible()
  expect(screen.getByText('Derived: 13')).toBeVisible()
  expect(screen.getByText('Derived2 component: 1')).toBeVisible()
  expect(screen.getByText('Derived2: 5')).toBeVisible()
  expect(screen.getByText('AsyncButton component: 1')).toBeVisible()

  await vi.advanceTimersByTimeAsync(10_001)

  expect(screen.getByText('Count: 8')).toBeVisible()
  expect(screen.getByText('Derived: 18')).toBeVisible()
  expect(screen.getByText('Derived2 component: 1')).toBeVisible()
  expect(screen.getByText('Derived2: 5')).toBeVisible()
  expect(screen.getByText('AsyncButton component: 1')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'ObjButton' }))

  expect(screen.getByText('Derived3 component: 2')).toBeVisible()
  expect(screen.getByText('Derived3: 2')).toBeVisible()
  expect(screen.getByText('Derived4 component: 1')).toBeVisible()
  expect(screen.getByText('Derived4: 99')).toBeVisible()
})

test('should batch state updates', async () => {
  const { useStore, useDispatch } = createStore({
    initialState: {
      count: 1,
      count2: 3,
    },

    events: ({ set }) => ({
      buttonClicked() {
        set((state) => {
          state.count = state.count + 1
          state.count2 = state.count2 + 1
        })
      },
    }),
  })

  const Counts: FC = () => {
    const count = useStore('count')
    const count2 = useStore('count2')
    return (
      <div>
        <div>Count: {count}</div>
        <div>Count2: {count2}</div>
        <RenderCount title="Counts" />
      </div>
    )
  }

  const Button: FC = () => {
    const buttonClicked = useDispatch('buttonClicked')
    return (
      <div>
        <button onClick={buttonClicked} type="button">
          Button
        </button>
      </div>
    )
  }

  const App = () => {
    return (
      <>
        <Button />
        <Counts />
      </>
    )
  }

  const user = userEvent.setup()
  render(<App />)

  expect(screen.getByText('Counts component: 1')).toBeVisible()
  expect(screen.getByText('Count: 1')).toBeVisible()
  expect(screen.getByText('Count2: 3')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Button' }))

  expect(screen.getByText('Counts component: 2')).toBeVisible()
  expect(screen.getByText('Count: 2')).toBeVisible()
  expect(screen.getByText('Count2: 4')).toBeVisible()
})

test('should render derived', async () => {
  const { useDispatch, useSelector } = createStore({
    initialState: {
      count: 1,
      count2: 3,
    },

    events: ({ reset, set }) => ({
      buttonClicked() {
        set((s) => {
          s.count = s.count + 1
        })
      },
      resetAll() {
        reset()
      },
      resetCount() {
        reset('count')
      },
    }),

    selectors: {
      total(state) {
        return state.count + state.count2
      },
    },
  })

  const Total: FC = () => {
    const total = useSelector('total')
    return (
      <div>
        <div>Total: {total}</div>
      </div>
    )
  }

  const Buttons: FC = () => {
    const buttonClicked = useDispatch('buttonClicked')
    const reset = useDispatch('resetAll')
    const resetCount = useDispatch('resetCount')
    return (
      <div>
        <button onClick={buttonClicked} type="button">
          Add
        </button>
        <button onClick={reset} type="button">
          Reset
        </button>
        <button onClick={resetCount} type="button">
          Reset Count
        </button>
      </div>
    )
  }

  const App = () => {
    return (
      <>
        <Buttons />
        <Total />
      </>
    )
  }

  const user = userEvent.setup()
  render(<App />)

  expect(screen.getByText('Total: 4')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Add' }))

  expect(screen.getByText('Total: 5')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Reset' }))

  expect(screen.getByText('Total: 4')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Add' }))

  expect(screen.getByText('Total: 5')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Reset Count' }))

  expect(screen.getByText('Total: 4')).toBeVisible()
})

test('should reset state', async () => {
  const { useDispatch, useStore } = createStore({
    initialState: {
      count: 1,
    },

    events: ({ reset, set }) => ({
      addButtonClicked() {
        set((s) => {
          s.count = s.count + 1
        })
      },
      resetButtonClicked() {
        reset('count')
      },
    }),
  })

  const App = () => {
    const count = useStore('count')
    const addButtonClicked = useDispatch('addButtonClicked')
    const resetButtonClicked = useDispatch('resetButtonClicked')
    return (
      <>
        <div>Count: {count}</div>
        <button onClick={addButtonClicked} type="button">
          Add Button
        </button>
        <button onClick={resetButtonClicked} type="button">
          Reset Button
        </button>
      </>
    )
  }

  const user = userEvent.setup()
  render(<App />)

  expect(screen.getByText('Count: 1')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Add Button' }))

  expect(screen.getByText('Count: 2')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Reset Button' }))

  expect(screen.getByText('Count: 1')).toBeVisible()
})

test('should remove subscriber on unmount', async () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => null)

  const { useDispatch, useStore, getSubscriberCount } = createStore({
    initialState: {
      something: 'something',
      todos: ['a'],
    },

    events: ({ set }) => ({
      addTodo() {
        const alphabet = 'abcdefghijk'
        set((s) => {
          s.todos.push(alphabet[s.todos.length])
        })
      },
      removeTodo() {
        set((s) => {
          s.todos.pop()
        })
      },
    }),
  })

  const Something = () => {
    const something = useStore('something')
    return something
  }

  const App = () => {
    const todos = useStore('todos')
    const addTodo = useDispatch('addTodo')
    const removeTodo = useDispatch('removeTodo')
    return (
      <>
        {todos.map((todo) => (
          <div key={todo}>
            {todo}: <Something />
          </div>
        ))}
        <button onClick={addTodo} type="button">
          Add
        </button>
        <button onClick={removeTodo} type="button">
          Remove
        </button>
      </>
    )
  }

  const user = userEvent.setup()
  render(<App />)

  expect(getSubscriberCount()).toBe(2)
  expect(screen.getByText('a: something')).toBeVisible()
  expect(screen.queryByText('b: something')).not.toBeInTheDocument()

  const addTodo = screen.getByText('Add')
  await user.click(addTodo)

  expect(getSubscriberCount()).toBe(3)
  expect(screen.getByText('a: something')).toBeVisible()
  expect(screen.getByText('b: something')).toBeVisible()

  await user.click(addTodo)

  expect(getSubscriberCount()).toBe(4)
  expect(screen.getByText('a: something')).toBeVisible()
  expect(screen.getByText('b: something')).toBeVisible()
  expect(screen.getByText('c: something')).toBeVisible()

  const removeTodo = screen.getByText('Remove')
  await user.click(removeTodo)

  expect(getSubscriberCount()).toBe(3)
  expect(screen.getByText('a: something')).toBeVisible()
  expect(screen.getByText('b: something')).toBeVisible()
  expect(screen.queryByText('c: something')).not.toBeInTheDocument()

  await user.click(removeTodo)

  expect(getSubscriberCount()).toBe(2)
  expect(screen.getByText('a: something')).toBeVisible()
  expect(screen.queryByText('b: something')).not.toBeInTheDocument()

  await user.click(removeTodo)

  expect(getSubscriberCount()).toBe(1)
  expect(screen.queryByText('a: something')).not.toBeInTheDocument()
  expect(errorSpy).not.toHaveBeenCalled()
})

test('should handle complex state', async () => {
  const { useDispatch, useStore } = createStore({
    initialState: {
      arr: ['hello'],
      data: id<{ bar: string; foo?: number }>({ bar: 'buz', foo: 1 }),
    },

    events: ({ set }) => ({
      addToArr(item: string) {
        set((s) => {
          s.arr.push(item)
        })
      },
      changeData() {
        set((s) => {
          s.data = { bar: 'moo', foo: 5 }
        })
      },
      changeDataDeep() {
        set((s) => {
          s.data.bar = 'www'
        })
      },
      deleteData() {
        set((s) => {
          delete s.data.foo
        })
      },
    }),
  })

  const Data = () => {
    const data = useStore('data')

    return (
      <div>
        {data.foo ? <div>Foo: {data.foo}</div> : null}
        <div>Bar: {data.bar}</div>
      </div>
    )
  }

  const Arr = () => {
    const arr = useStore('arr')

    return (
      <div>
        {arr.map((a) => (
          <div key={a}>{a}</div>
        ))}
      </div>
    )
  }

  const Buttons = () => {
    const changeData = useDispatch('changeData')
    const changeDataDeep = useDispatch('changeDataDeep')
    const deleteData = useDispatch('deleteData')
    const addToArr = useDispatch('addToArr')
    return (
      <div>
        <button onClick={changeData} type="button">
          Change Data
        </button>
        <button onClick={changeDataDeep} type="button">
          Change Data Deep
        </button>
        <button onClick={deleteData} type="button">
          Delete Data
        </button>
        <button onClick={() => addToArr('bye')} type="button">
          Add To Array
        </button>
      </div>
    )
  }

  const App = () => {
    return (
      <div>
        <Data />
        <Arr />
        <Buttons />
      </div>
    )
  }

  const user = userEvent.setup()
  render(<App />)

  expect(screen.getByText('Foo: 1')).toBeVisible()
  expect(screen.getByText('Bar: buz')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Change Data' }))

  expect(screen.getByText('Foo: 5')).toBeVisible()
  expect(screen.getByText('Bar: moo')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Change Data Deep' }))

  expect(screen.getByText('Foo: 5')).toBeVisible()
  expect(screen.getByText('Bar: www')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Delete Data' }))

  expect(screen.queryByText('Foo:')).not.toBeInTheDocument()
  expect(screen.getByText('Bar: www')).toBeVisible()

  expect(screen.getByText('hello')).toBeVisible()
  expect(screen.queryByText('bye')).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Add To Array' }))

  expect(screen.getByText('hello')).toBeVisible()
  expect(screen.getByText('bye')).toBeVisible()
})

test('should handle complex derived state', async () => {
  const { useDispatch, useSelector } = createStore({
    initialState: {
      idCounter: 1,
    },

    events: ({ set, reset }) => ({
      add() {
        set((s) => {
          s.idCounter = s.idCounter + 1
        })
      },
      noop() {
        //
      },
      reset() {
        reset('idCounter')
      },
    }),

    selectors: {
      derivedState(s) {
        return s.idCounter === 2 ? { foo: true } : { foo: false }
      },
      emptyObj() {
        return {}
      },
    },
  })

  const App = () => {
    const derivedState = useSelector('derivedState')
    const emptyObj = useSelector('emptyObj')
    const add = useDispatch('add')
    const reset = useDispatch('reset')
    return (
      <div>
        <button onClick={add} type="button">
          Add
        </button>
        <button onClick={reset} type="button">
          Reset
        </button>
        <div data-testid="derived">{derivedState.foo ? 'yes' : 'no'}</div>
        <div>{JSON.stringify(emptyObj)}</div>
      </div>
    )
  }

  const user = userEvent.setup()
  render(<App />)

  expect(screen.getByTestId('derived')).toHaveTextContent('no')

  await user.click(screen.getByRole('button', { name: 'Add' }))

  expect(screen.getByTestId('derived')).toHaveTextContent('yes')

  await user.click(screen.getByRole('button', { name: 'Reset' }))

  expect(screen.getByTestId('derived')).toHaveTextContent('no')
})

test('should call subscriptions', async () => {
  const sub1Spy = vi.fn<() => void>()
  const sub2Spy = vi.fn<() => void>()
  const sub3Spy = vi.fn<(obj: { foo: string; moo: string }) => void>()

  const { useDispatch, useStore } = createStore({
    initialState: {
      counter: 1,
      counter2: 5,
      object: { foo: 'bar', moo: 'mar' },
    },

    events: ({ set }) => ({
      add() {
        set((s) => {
          s.counter = s.counter + 1
        })
      },
      add2() {
        set((s) => {
          s.counter2 = s.counter2 + 1
        })
      },
      changeFoo() {
        set((s) => {
          s.object.foo = 'oof'
        })
      },
      changeMoo() {
        set((s) => {
          s.object.moo = 'baz'
        })
      },
    }),

    subscriptions: [
      [
        (s) => s.counter,
        () => {
          sub1Spy()
        },
      ],
      [
        (s) => s.counter2,
        () => {
          sub2Spy()
        },
      ],
      [
        (s) => s.object.foo,
        ({ dispatch, get }) => {
          dispatch('changeMoo')
          sub3Spy(get().object)
        },
      ],
    ],
  })

  const App = () => {
    const add = useDispatch('add')
    const add2 = useDispatch('add2')
    const changeFoo = useDispatch('changeFoo')
    const counter = useStore('counter')
    const counter2 = useStore('counter2')
    const object = useStore('object')
    return (
      <div>
        <button onClick={add} type="button">
          Add
        </button>
        <button onClick={add2} type="button">
          Add2
        </button>
        <button onClick={changeFoo} type="button">
          ChangeFoo
        </button>
        <div>{JSON.stringify({ counter, counter2, object })}</div>
      </div>
    )
  }

  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('button', { name: 'Add' }))

  expect(sub1Spy).toHaveBeenCalledOnce()
  expect(sub2Spy).not.toHaveBeenCalled()
  expect(sub3Spy).not.toHaveBeenCalled()

  await user.click(screen.getByRole('button', { name: 'Add2' }))

  expect(sub1Spy).toHaveBeenCalledOnce()
  expect(sub2Spy).toHaveBeenCalledOnce()
  expect(sub3Spy).not.toHaveBeenCalled()

  await user.click(screen.getByRole('button', { name: 'ChangeFoo' }))

  expect(sub1Spy).toHaveBeenCalledOnce()
  expect(sub2Spy).toHaveBeenCalledOnce()
  expect(sub3Spy).toHaveBeenCalledExactlyOnceWith({ foo: 'oof', moo: 'baz' })

  expect(
    screen.getByText(
      JSON.stringify({
        counter: 2,
        counter2: 6,
        object: { foo: 'oof', moo: 'baz' },
      }),
    ),
  ).toBeInTheDocument()
})
