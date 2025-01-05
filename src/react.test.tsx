import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import type { FC } from 'react'
import { useRef } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { TwoAndEight } from './2n8.js'
import { createReactStore } from './react.js'

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
      this.$emit()
      await new Promise((res) => {
        setTimeout(res, 10_000)
      })
      this.count = this.count + 5
    }
  }

  const useStore = createReactStore(new Store())

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
    const derived = useStore('derived')
    return (
      <div>
        <div>Derived: {derived}</div>
        <RenderCount title="Derived" />
      </div>
    )
  }

  const Button: FC = () => {
    const buttonClicked = useStore('buttonClicked')
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
    const asyncButtonClicked = useStore('asyncButtonClicked')
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
  await vi.advanceTimersByTimeAsync(10_001)
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

  const useStore = createReactStore(new Store())

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
    const buttonClicked = useStore('buttonClicked')
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
  class Store extends TwoAndEight {
    count = 1
    count2 = 3

    get total() {
      return this.count + this.count2
    }

    buttonClicked() {
      this.count = this.count + 1
    }

    reset() {
      this.$reset()
    }

    resetCount() {
      this.$reset('count')
    }
  }

  const useStore = createReactStore(new Store())

  const Total: FC = () => {
    const total = useStore('total')
    return (
      <div>
        <div>Total: {total}</div>
      </div>
    )
  }

  const Buttons: FC = () => {
    const buttonClicked = useStore('buttonClicked')
    const reset = useStore('reset')
    const resetCount = useStore('resetCount')
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
  class Store extends TwoAndEight {
    count = 1

    addButtonClicked() {
      this.count = this.count + 1
    }

    resetButtonClicked() {
      this.$reset('count')
    }
  }

  const useStore = createReactStore(new Store())

  const App = () => {
    const count = useStore('count')
    const addButtonClicked = useStore('addButtonClicked')
    const resetButtonClicked = useStore('resetButtonClicked')
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

  class Store extends TwoAndEight {
    something = 'something'
    todos = ['a']

    addTodo() {
      const alphabet = 'abcdefghijk'
      this.todos.push(alphabet[this.todos.length])
    }

    removeTodo() {
      this.todos.pop()
    }
  }

  const useStore = createReactStore(new Store())

  const Something = () => {
    const something = useStore('something')
    return something
  }

  const App = () => {
    const todos = useStore('todos')
    const addTodo = useStore('addTodo')
    const removeTodo = useStore('removeTodo')
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
  expect(screen.getByText('a: something')).toBeVisible()
  expect(screen.queryByText('b: something')).not.toBeInTheDocument()
  expect(useStore.$getSubscribersCount()).toBe(4)
  const addTodo = screen.getByText('Add')
  await user.click(addTodo)
  expect(screen.getByText('a: something')).toBeVisible()
  expect(screen.getByText('b: something')).toBeVisible()
  expect(useStore.$getSubscribersCount()).toBe(5)
  await user.click(addTodo)
  expect(screen.getByText('a: something')).toBeVisible()
  expect(screen.getByText('b: something')).toBeVisible()
  expect(screen.getByText('c: something')).toBeVisible()
  expect(useStore.$getSubscribersCount()).toBe(6)
  const removeTodo = screen.getByText('Remove')
  await user.click(removeTodo)
  expect(screen.getByText('a: something')).toBeVisible()
  expect(screen.getByText('b: something')).toBeVisible()
  expect(screen.queryByText('c: something')).not.toBeInTheDocument()
  expect(useStore.$getSubscribersCount()).toBe(5)
  await user.click(removeTodo)
  expect(screen.getByText('a: something')).toBeVisible()
  expect(screen.queryByText('b: something')).not.toBeInTheDocument()
  expect(useStore.$getSubscribersCount()).toBe(4)
  await user.click(removeTodo)
  expect(screen.queryByText('a: something')).not.toBeInTheDocument()
  expect(errorSpy).not.toHaveBeenCalled()
  expect(useStore.$getSubscribersCount()).toBe(3)
})

test('should handle complex state', async () => {
  class Store extends TwoAndEight {
    data: { bar: string; foo?: number } = { bar: 'buz', foo: 1 }
    arr = ['hello']

    changeData() {
      this.data = { bar: 'moo', foo: 5 }
    }

    changeDataDeep() {
      this.data.bar = 'www'
    }

    deleteData() {
      delete this.data.foo
    }

    addToArr() {
      this.arr.push('bye')
    }
  }

  const useStore = createReactStore(new Store())

  const App = () => {
    const data = useStore('data')
    const arr = useStore('arr')
    const changeData = useStore('changeData')
    const changeDataDeep = useStore('changeDataDeep')
    const deleteData = useStore('deleteData')
    const addToArr = useStore('addToArr')
    return (
      <div>
        {data.foo ? <div>Foo: {data.foo}</div> : null}
        <div>Bar: {data.bar}</div>
        <div>
          {arr.map((a) => (
            <div key={a}>{a}</div>
          ))}
        </div>
        <button onClick={changeData} type="button">
          Change Data
        </button>
        <button onClick={changeDataDeep} type="button">
          Change Data Deep
        </button>
        <button onClick={deleteData} type="button">
          Delete Data
        </button>
        <button onClick={addToArr} type="button">
          Add To Array
        </button>
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

  const useStore = createReactStore(new Store())

  const App = () => {
    const derivedState = useStore('derivedState')
    const emptyObj = useStore('emptyObj')
    const add = useStore('add')
    const reset = useStore('reset')
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

test('should forward on API', () => {
  class Store extends TwoAndEight {}
  const useStore = createReactStore(new Store())
  expect(useStore.$subscribe).toStrictEqual(expect.any(Function))
  expect(useStore.$getInitialState).toStrictEqual(expect.any(Function))
  expect(useStore.$getSubscribersCount).toStrictEqual(expect.any(Function))
})
