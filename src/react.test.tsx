import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import type { FC } from 'react'
import { useRef } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { TwoAndEight } from './2n8.js'
import { createStore } from './react.js'

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

test('should reset state', async () => {
  class Store extends TwoAndEight {
    count = 1

    addButtonClicked() {
      this.count = this.count + 1
    }

    resetButtonClicked() {
      this.$reset('count')
    }
  }

  const useStore = createStore(new Store())

  const App = () => {
    const count = useStore((s) => s.count)
    const addButtonClicked = useStore((s) => s.addButtonClicked)
    const resetButtonClicked = useStore((s) => s.resetButtonClicked)
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

test('should remove listener on unmount', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => null)

  class Store extends TwoAndEight {
    count = 1
  }

  const useStore = createStore(new Store())

  const App = () => {
    const count = useStore((s) => s.count)
    return <div>Count: {count}</div>
  }

  const { unmount } = render(<App />)
  unmount()
  expect(errorSpy).not.toHaveBeenCalled()
})
