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

    get derived() {
      return this.count + 10
    }

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

  const Derived: FC = () => {
    const derived = useStore((s) => s.derived)
    return (
      <div>
        <div>Derived: {derived}</div>
        <RenderCount title="Derived" />
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
        <Derived />
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
  expect(screen.getByText('Button component: 1')).toBeVisible()
  await user.click(screen.getByRole('button', { name: 'Button' }))
  expect(screen.getByText('App component: 1')).toBeVisible()
  expect(screen.getByText('Count component: 2')).toBeVisible()
  expect(screen.getByText('Count: 1')).toBeVisible()
  expect(screen.getByText('Derived component: 2')).toBeVisible()
  expect(screen.getByText('Derived: 11')).toBeVisible()
  expect(screen.getByText('Button component: 1')).toBeVisible()
  await user.click(screen.getByRole('button', { name: 'Button' }))
  expect(screen.getByText('App component: 1')).toBeVisible()
  expect(screen.getByText('Count component: 3')).toBeVisible()
  expect(screen.getByText('Count: 2')).toBeVisible()
  expect(screen.getByText('Derived component: 3')).toBeVisible()
  expect(screen.getByText('Derived: 12')).toBeVisible()
  expect(screen.getByText('Button component: 1')).toBeVisible()
  await user.click(screen.getByRole('button', { name: 'AsyncButton' }))
  expect(screen.getByText('Count: 3')).toBeVisible()
  expect(screen.getByText('Derived: 13')).toBeVisible()
  await act(() => vi.advanceTimersByTime(10_001))
  expect(screen.getByText('Count: 8')).toBeVisible()
  expect(screen.getByText('Derived: 18')).toBeVisible()
})

test('should batch state updates', async () => {
  class Store extends TwoAndEight {
    count = 1
    count2 = 3

    buttonClicked() {
      this.count = this.count + 1
      this.count2 = this.count2 + 1
    }
  }

  const useStore = createStore(new Store())

  const Counts: FC = () => {
    const count = useStore((s) => s.count)
    const count2 = useStore((s) => s.count2)
    return (
      <div>
        <div>Count: {count}</div>
        <div>Count2: {count2}</div>
        <RenderCount title="Counts" />
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

test('should handle complex state', async () => {
  class Store extends TwoAndEight {
    data: { bar: string; foo: number } = { bar: 'buz', foo: 1 }

    changeData() {
      this.data = { bar: 'moo', foo: 5 }
    }
  }

  const useStore = createStore(new Store())

  const App = () => {
    const data = useStore((s) => s.data)
    const changeData = useStore((s) => s.changeData)
    return (
      <div>
        <div>Foo: {data.foo}</div>
        <div>Bar: {data.bar}</div>
        <button onClick={changeData}>Change Data</button>
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
})

test('should handle complex derived state', async () => {
  class Store extends TwoAndEight {
    idCounter = 1

    get derivedState() {
      return this.idCounter === 2 ? { foo: true } : { foo: false }
    }

    get emptyObj() {
      return {}
    }

    add() {
      this.idCounter = this.idCounter + 1
    }

    noop() {
      //
    }

    reset() {
      this.$reset('idCounter')
    }
  }

  const useStore = createStore(new Store())

  const App = () => {
    const derivedState = useStore((s) => s.derivedState)
    const emptyObj = useStore((s) => s.emptyObj)
    const add = useStore((s) => s.add)
    const reset = useStore((s) => s.reset)
    return (
      <div>
        <button onClick={add}>Add</button>
        <button onClick={reset}>Reset</button>
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
