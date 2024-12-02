import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import type { FC } from 'react'
import { useRef } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { createStore, TwoAndEight } from './2n8.js'

const RenderCount: FC<{ title: string }> = ({ title }) => {
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

test('should update count component and not rerender others', async () => {
  class Store extends TwoAndEight {
    count = 0

    buttonClicked() {
      this.count = this.count + 1
    }

    async asyncButtonClicked() {
      this.count = this.count + 1
      await new Promise((res) => {
        setTimeout(res, 10_000)
      })
      this.count = this.count + 5
    }
  }

  const useStore = createStore(new Store())

  const Count: FC = () => {
    const count = useStore((s) => s.count)
    return (
      <div>
        <div>Count: {count}</div>
        <RenderCount title="Count" />
      </div>
    )
  }

  const Button: FC = () => {
    const buttonClicked = useStore((s) => s.buttonClicked)
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
    const asyncButtonClicked = useStore((s) => s.asyncButtonClicked)
    return (
      <div>
        <button onClick={asyncButtonClicked} type="button">
          AsyncButton
        </button>
        <RenderCount title="AsyncButton" />
      </div>
    )
  }

  const App = () => {
    return (
      <>
        <Button />
        <AsyncButton />
        <Count />
        <RenderCount title="App" />
      </>
    )
  }

  const user = userEvent.setup()

  render(<App />)

  expect(screen.getByText('App component: 1')).toBeVisible()
  expect(screen.getByText('Count component: 1')).toBeVisible()
  expect(screen.getByText('Count: 0')).toBeVisible()
  expect(screen.getByText('Button component: 1')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Button' }))

  expect(screen.getByText('App component: 1')).toBeVisible()
  expect(screen.getByText('Count component: 2')).toBeVisible()
  expect(screen.getByText('Count: 1')).toBeVisible()
  expect(screen.getByText('Button component: 1')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Button' }))

  expect(screen.getByText('App component: 1')).toBeVisible()
  expect(screen.getByText('Count component: 3')).toBeVisible()
  expect(screen.getByText('Count: 2')).toBeVisible()
  expect(screen.getByText('Button component: 1')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'AsyncButton' }))

  expect(screen.getByText('Count: 3')).toBeVisible()

  await act(() => vi.advanceTimersByTime(10_001))

  expect(screen.getByText('Count: 8')).toBeVisible()
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

test('should render computed', async () => {
  class Store extends TwoAndEight {
    count = 1
    count2 = 3

    get total() {
      return this.count + this.count2
    }

    buttonClicked() {
      this.count = this.count + 1
    }
  }

  const useStore = createStore(new Store())

  const Total: FC = () => {
    const total = useStore((s) => s.total)
    return (
      <div>
        <div>Total: {total}</div>
      </div>
    )
  }

  const Button: FC = () => {
    const buttonClicked = useStore((s) => s.buttonClicked)
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
        <Total />
      </>
    )
  }

  const user = userEvent.setup()

  render(<App />)

  expect(screen.getByText('Total: 4')).toBeVisible()

  await user.click(screen.getByRole('button', { name: 'Button' }))

  expect(screen.getByText('Total: 5')).toBeVisible()
})
