/* eslint-disable vitest/expect-expect */
/* eslint-disable no-console */
import { act, fireEvent, render, screen } from '@testing-library/react'
import { StrictMode, useEffect, useLayoutEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { afterEach, expect, test, vi } from 'vitest'

import type { StateFields } from '../2n8.js'
import { createStore, TwoAndEight } from '../2n8.js'
import { createReactStore } from '../react.js'

const consoleError = console.error

afterEach(() => {
  console.error = consoleError
})

test('only re-renders if selected state has changed', async () => {
  class Store extends TwoAndEight {
    count = 0
    inc = () => {
      this.count++
    }
  }

  const useBoundStore = createReactStore(new Store())
  let counterRenderCount = 0
  let controlRenderCount = 0

  function Counter() {
    const count = useBoundStore('count')
    counterRenderCount++
    return <div>count: {count}</div>
  }

  function Control() {
    const inc = useBoundStore('inc')
    controlRenderCount++
    return (
      <button onClick={inc} type="button">
        button
      </button>
    )
  }

  render(
    <>
      <Counter />
      <Control />
    </>,
  )

  fireEvent.click(screen.getByText('button'))

  await screen.findByText('count: 1')

  expect(counterRenderCount).toBe(2)
  expect(controlRenderCount).toBe(1)
})

test('can batch updates', async () => {
  class Store extends TwoAndEight {
    count = 0
    inc = () => {
      this.count++
    }
  }

  const useBoundStore = createReactStore(new Store())

  function Counter() {
    const count = useBoundStore('count')
    const inc = useBoundStore('inc')
    useEffect(() => {
      ReactDOM.unstable_batchedUpdates(() => {
        inc()
        inc()
      })
    }, [inc])
    return <div>count: {count}</div>
  }

  render(<Counter />)

  await screen.findByText('count: 2')
})

test('can update the selector', async () => {
  class Store extends TwoAndEight {
    one = 'one'
    two = 'two'
  }
  type Props = { selector: keyof StateFields<Store> }
  const useBoundStore = createReactStore(new Store())

  function Component({ selector }: Props) {
    return <div>{useBoundStore(selector)}</div>
  }

  const { rerender } = render(
    <StrictMode>
      <Component selector="one" />
    </StrictMode>,
  )
  await screen.findByText('one')

  rerender(
    <StrictMode>
      <Component selector="two" />
    </StrictMode>,
  )
  await screen.findByText('two')
})

test('both NaN should not update', () => {
  class Store extends TwoAndEight {
    number = Number.NaN
    setNaN = () => {
      this.number = Number.NaN
    }
  }

  const { get, subscribe } = createStore(new Store())

  const fn = vi.fn<() => void>()
  subscribe('number', fn)
  get('setNaN')

  expect(fn).not.toHaveBeenCalled()
})

test('ensures parent components subscribe before children', async () => {
  type Props = { id: string }
  class Store extends TwoAndEight {
    children: Record<string, { text: string }> = {
      '1': { text: 'child 1' },
      '2': { text: 'child 2' },
    }
    changeState = () => {
      this.children['3'] = { text: 'child 3' }
    }
  }
  const useBoundStore = createReactStore(new Store())
  const api = useBoundStore

  function changeState() {
    api.get('changeState')()
  }

  function Child({ id }: Props) {
    const children = useBoundStore('children')
    return <div>{children[id].text}</div>
  }

  function Parent() {
    const childStates = useBoundStore('children')

    return (
      <>
        <button onClick={() => changeState()} type="button">
          change state
        </button>
        {Object.keys(childStates).map((id) => (
          <Child key={id} id={id} />
        ))}
      </>
    )
  }

  render(
    <StrictMode>
      <Parent />
    </StrictMode>,
  )

  fireEvent.click(screen.getByText('change state'))

  await screen.findByText('child 3')
})

// https://github.com/pmndrs/zustand/issues/84
test('ensures the correct subscriber is removed on unmount', async () => {
  class Store extends TwoAndEight {
    count = 0
    increment = () => {
      this.count++
    }
  }
  const useBoundStore = createReactStore(new Store())
  const api = useBoundStore

  function increment() {
    api.get('increment')()
  }

  function Count() {
    const c = useBoundStore('count')
    return <div>count: {c}</div>
  }

  function CountWithInitialIncrement() {
    useLayoutEffect(increment, [])
    return <Count />
  }

  function Component() {
    // eslint-disable-next-line react/hook-use-state
    const [Counter, setCounter] = useState(() => CountWithInitialIncrement)
    useLayoutEffect(() => {
      setCounter(() => Count)
    }, [])
    return (
      <>
        <Counter />
        <Count />
      </>
    )
  }

  render(<Component />)

  await expect(screen.findAllByText('count: 1')).resolves.toHaveLength(2)

  act(increment)

  await expect(screen.findAllByText('count: 2')).resolves.toHaveLength(2)
})

// https://github.com/pmndrs/zustand/issues/86
test('ensures a subscriber is not mistakenly overwritten', async () => {
  class Store extends TwoAndEight {
    count = 0
    setOne = () => {
      this.count = 1
    }
  }
  const useBoundStore = createReactStore(new Store())
  const api = useBoundStore

  function Count1() {
    const c = useBoundStore('count')
    return <div>count1: {c}</div>
  }

  function Count2() {
    const c = useBoundStore('count')
    return <div>count2: {c}</div>
  }

  // Add 1st subscriber.
  const { rerender } = render(
    <StrictMode>
      <Count1 />
    </StrictMode>,
  )

  // Replace 1st subscriber with another.
  rerender(
    <StrictMode>
      <Count2 />
    </StrictMode>,
  )

  // Add 2 additional subscribers.
  rerender(
    <StrictMode>
      <Count2 />
      <Count1 />
      <Count1 />
    </StrictMode>,
  )

  // Call all subscribers
  act(() => api.get('setOne')())

  await expect(screen.findAllByText('count1: 1')).resolves.toHaveLength(2)
  await expect(screen.findAllByText('count2: 1')).resolves.toHaveLength(1)
})

test('works with "undefined" state', async () => {
  class Store extends TwoAndEight {}
  const useBoundStore = createReactStore(new Store())

  const Component = () => {
    // @ts-expect-error -- deliberately getting field that doesn't exist.
    const str = useBoundStore('not-a-field')
    return <div>str: {String(str)}</div>
  }

  render(
    <StrictMode>
      <Component />
    </StrictMode>,
  )

  await screen.findByText('str: undefined')
})
