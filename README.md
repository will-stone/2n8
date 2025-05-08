# 🫤 2n8

<p align="center">
  <img src="https://raw.githubusercontent.com/will-stone/2n8/main/media/logo.png" alt="tings" width="200" height="200" />
</p>

> Oh my, your store is in a right
> [two and eight](https://cockneyrhymingslang.co.uk/slang/two_and_eight/).

A lightweight JavaScript / TypeScript state management library that uses a
class-based store.

Key features include:

- Action based state flow.
- Built-in subscription system for reactive updates.
- Flexible state reset functionality for entire state or specific fields.
- Type-safe state management.
- Minimal boilerplate.

```tsx
import { TwoAndEight, createReactStore } from '2n8'

class Store extends TwoAndEight {
  count = 0

  // Make sure to use arrow-functions to bind `this`.
  addClicked = () => {
    this.count++
  }

  resetClicked = () => {
    this.$reset('count')
  }
}

const useStore = createReactStore(new Store())

const Counter = () => {
  const count = useStore('count')
  const addClicked = useStore('addClicked')
  const resetClicked = useStore('resetClicked')
  return (
    <div>
      <span>{count}</span>
      <button onClick={addClicked}>One up</button>
      <button onClick={resetClicked}>Reset</button>
    </div>
  )
}
```

## Getting Started

### Installation

```sh
npm i 2n8
yarn add 2n8
pnpm add 2n8
bun add 2n8
```

### Create a store

Your store is a class, and turning it into a React hook is as easy as passing it
to the `createReactStore` utility.

```ts
// store.ts
import { TwoAndEight, createReactStore } from '2n8'

class Store extends TwoAndEight {
  expression: '🫤' | '🥸' = '🫤'

  addDisguise = () => {
    this.expression = '🥸'
  }

  resetToConfusion = () => {
    this.$reset('expression')
  }
}

export const useStore = createReactStore(new Store())
```

### Import the hook into your React components

The hook provides a direct connection to your store. When you modify the state,
the consuming component automatically re-renders to reflect those changes.

```tsx
// Expression.tsx
import { useStore } from './store'

function Expression() {
  const expression = useStore('expression')
  return <h1>{expression}</h1>
}
```

```tsx
// App.tsx
import { useStore } from './store'

function App() {
  const addDisguise = useStore('addDisguise')
  const resetToConfusion = useStore('resetToConfusion')
  return (
    <>
      <button onClick={addDisguise}>Hide!</button>
      <button onClick={resetToConfusion}>What?!</button>
    </>
  )
}
```

## State and Actions

_State_ is initiated using class fields. The class must be extended from 2n8's
parent class which enhances the store with a few utilities.

```tsx
// store.ts
import { TwoAndEight } from '2n8'

class Store extends TwoAndEight {
  counter = 0
}
```

State changes are made inside _actions_, which are simply class methods that
mutate the fields.

```tsx
// store.ts
class Store extends TwoAndEight {
  counter = 0

  addButtonClicked = () => {
    this.counter++
  }
}
```

> [!WARNING]  
> The class methods must use arrow functions in order to bind `this`.

Generate your React hook:

```tsx
// store.ts
export const useStore = createReactStore(new Store())
```

This uses React's
[`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore)
hook to _subscribe_ to state changes:

```tsx
// Component.tsx
import { useStore } from './store'

const Component = () => {
  const counter = useStore('counter')

  return <div>{counter}</div>
}
```

When, and only when, the selected state changes, the component is rerendered by
React. This is more optimal than simply passing state down the component tree
via props.

Select and call actions from the store:

```tsx
// Component2.tsx
import { useStore } from './store'

const Component2 = () => {
  const addButtonClicked = useStore('addButtonClicked')

  return <button onClick={addButtonClicked}>Add</button>
}
```

When actions are called, the current values of all state are _emitted_ to the
subscribers at the end of the action.

## Async Actions

Running asynchronous actions is as simple as making an async method on your
store class.

```tsx
// store.ts
import { TwoAndEight } from '2n8'

import { fetchData } from './data-fetcher'

class Store extends TwoAndEight {
  data: { id: string; name: string }[] = []

  loadDataButtonClicked = async () => {
    this.data = await fetchData()
  }
}
```

As state is only emitted at the **end** of actions, you may find you'd like to
emit earlier to trigger state changes in your app. For this you can use the
special `$emit` action.

```tsx
// store.ts
import { TwoAndEight } from '2n8'

import { fetchData } from './data-fetcher'

class Store extends TwoAndEight {
  data: { id: string; name: string }[] = []
  status: 'idle' | 'pending' = 'idle'

  loadDataButtonClicked = async () => {
    this.status = 'pending'
    this.$emit()
    this.data = await fetchData()
    this.status = 'idle'
  }
}
```

> [!WARNING]  
> All state currently set within the store will be emitted when you call the
> `$emit` action. This includes changes made by other actions in this time.

## Derived State

State values based on one or more other state values, known as derived state,
can be created using _getters_.

```tsx
// store.ts
import { TwoAndEight } from '2n8'

class Store extends TwoAndEight {
  counter = 0
  secondCounter = 10

  // Getters do not use arrow functions.
  get totalCounters() {
    return this.counter + this.secondCounter
  }
}

export const useStore = createReactStore(new Store())
```

Any subscribers to `totalCounters` will update when either `counter` or
`secondCounter` are updated.

```tsx
// Component.tsx
import { useStore } from './store'

const Component = () => {
  const totalCounters = useStore('totalCounters')

  return <div>{totalCounters}</div>
}
```

## Reset State

If you need to reset a state value to its initial value, you can call the
special `$reset` action.

```tsx
// store.ts
import { TwoAndEight } from '2n8'

class Store extends TwoAndEight {
  counter = 0

  addButtonClicked = () => {
    this.counter++
  }

  resetButtonClicked = () => {
    this.$reset('counter')
  }
}

export const useStore = createReactStore(new Store())
```

```tsx
// Component.tsx
import { useStore } from './store'

const Component = () => {
  const counter = useStore('counter')
  const addButtonClicked = useStore('addButtonClicked')
  const resetButtonClicked = useStore('resetButtonClicked')

  return (
    <div>
      <div>{counter}</div>
      <button onClick={addButtonClicked}>Add</button>
      <button onClick={resetButtonClicked}>Reset</button>
    </div>
  )
}
```

In the above example, clicking `Add` will update the displayed `counter` to `1`.
Clicking `Reset` will put the `counter` back to `0`.

> [!TIP]  
> You can call `$reset()` without a field parameter to reset _all_ state in the
> store.

## Comparison

2n8 feels like a blend between two excellent state management libraries:
[Zustand](https://zustand.docs.pmnd.rs/) and [MobX](https://mobx.js.org/).
Therefore, here's a quick comparison with those two packages.

> [!IMPORTANT]  
> There are always compromises. 2n8 aims for simplicity when setting up your
> store code using TypeScript, but the other two libraries mentioned here are
> far more mature and have a great ecosystem and community. Please use the tool
> that best suits your use case.

### Boilerplate

The main reason for creating 2n8 was to limit the amount of boilerplate and
repetition required to make a store when using TypeScript. Here's a simple
counter example:

#### 2n8

```tsx
import { TwoAndEight, createReactStore } from '2n8'

class Store extends TwoAndEight {
  count = 0

  addClicked = () => {
    this.count++
  }

  resetClicked = () => {
    this.$reset('count')
  }
}

const useStore = createReactStore(new Store())

const Counter = () => {
  const count = useStore('count')
  const addClicked = useStore('addClicked')
  const resetClicked = useStore('resetClicked')
  return (
    <div>
      <span>{count}</span>
      <button onClick={addClicked}>One up</button>
      <button onClick={resetClicked}>Reset</button>
    </div>
  )
}
```

#### Zustand

```tsx
import { create } from 'zustand'

type State = {
  count: number
}

type Actions = {
  addClicked: () => void
  resetClicked: () => void
}

const initialState: State = {
  count: 0,
}

const useStore = create<State & Actions>()((set) => ({
  ...initialState,
  addClicked: () =>
    set((state) => ({
      ...state,
      count: state.count + 1,
    })),
  resetClicked: () =>
    set((state) => ({
      ...state,
      count: initialState.count,
    })),
}))

const Counter = () => {
  const count = useStore((state) => state.count)
  const addClicked = useStore((state) => state.addClicked)
  const resetClicked = useStore((state) => state.resetClicked)
  return (
    <div>
      <span>{count}</span>
      <button onClick={addClicked}>One up</button>
      <button onClick={resetClicked}>Reset</button>
    </div>
  )
}
```

#### Mobx

```tsx
import { observer } from 'mobx-react-lite'
import { makeAutoObservable } from 'mobx'

type State = {
  count: number
}

const initialState: State = {
  count: 0,
}

class Store {
  count = initialState.count

  constructor() {
    makeAutoObservable(this)
  }

  addClicked() {
    this.count++
  }

  resetClicked() {
    this.count = initialState.count
  }
}

const store = new Store()

const Counter = observer(() => {
  return (
    <div>
      <span>{store.count}</span>
      <button onClick={store.addClicked}>One up</button>
      <button onClick={store.resetClicked}>Reset</button>
    </div>
  )
})
```

In this example, 2n8 requires the least store boilerplate whereas MobX needs
less component binding.

The advantage of 2n8's concise store implementation is that it doesn't require
external type definitions or an initial state object. TypeScript can infer types
inside the class too; take another look at the 2n8 example, there's no types in
sight, but this store automatically has the correct types for both state and
actions.

### Features

|                                                 | 2n8                               | Zustand                                                                                                 | MobX                       |
| ----------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------- |
| When do subscribers run?                        | After action (or on manual emit). | After set state.                                                                                        | At the end of actions.     |
| What equality checks are made on state changes? | Deep equality check is built-in.  | Uses `Object.is` by default for equality, and shallow or deep equality checking must be manually added. | Deep changes are observed. |
| How do components connect to state and actions? | Hooks.                            | Hooks.                                                                                                  | Observer wrapper function. |

### Bundle size

|                           | Bundle size | GZipped | Notes                                                                      |
| ------------------------- | ----------- | ------- | -------------------------------------------------------------------------- |
| [2n8][2n8-bundle]         | 10.8 kB     | 4.13 kB |                                                                            |
| [Zustand][zustand-bundle] | 17.4 kB     | 6.53 kB | Includes `useShallow` hook and `immer` middleware to match feature parity. |
| [MobX][mobx-bundle]       | 74.9 kB     | 21.9 kB |                                                                            |

[2n8-bundle]:
  https://bundlejs.com/?q=2n8%400.16.0&treeshake=%5B%7BTwoAndEight%2CcreateReactStore%7D%5D
[zustand-bundle]:
  https://bundlejs.com/?q=zustand%405.0.3%2Czustand%405.0.3%2Freact%2Fshallow%2Czustand%2Fmiddleware%2Fimmer&treeshake=%5B%7B+create+%7D%5D%2C%5B%7B+useShallow+%7D%5D%2C%5B%7B+immer+%7D%5D
[mobx-bundle]:
  https://bundlejs.com/?q=mobx%406.13.5%2Cmobx-react-lite%404.1.0&treeshake=%5B%7BmakeAutoObservable%7D%5D%2C%5B%7Bobserver%7D%5D

### Benchmarks

Here's a benchmark for the libraries running in React on an Apple MacBook Air
M2. It shows that the libraries all display very similar performance.

Run 1:

```
✓ src/react.bench.tsx > simple count 1874ms
    name          hz      min      max     mean      p75      p99     p995     p999     rme  samples
  · 2n8      75.8525  11.6857  14.8863  13.1835  13.6438  14.8863  14.8863  14.8863  ±1.87%       38   fastest
  · mobx     74.2115  11.6380  18.4382  13.4750  13.6820  18.4382  18.4382  18.4382  ±3.23%       38
  · zustand  72.6212  11.7150  19.2436  13.7701  14.7164  19.2436  19.2436  19.2436  ±3.85%       37   slowest

BENCH  Summary

2n8 - src/react.bench.tsx > simple count
  1.02x faster than mobx
  1.04x faster than zustand
```

Run 2:

```
✓ src/react.bench.tsx > simple count 1881ms
    name          hz      min      max     mean      p75      p99     p995     p999     rme  samples
  · 2n8      75.1111  11.7725  17.8066  13.3136  13.6982  17.8066  17.8066  17.8066  ±2.45%       38   fastest
  · mobx     72.5903  11.9117  17.1061  13.7759  14.4564  17.1061  17.1061  17.1061  ±3.28%       37   slowest
  · zustand  74.0253  11.5298  16.7901  13.5089  14.3196  16.7901  16.7901  16.7901  ±2.92%       38

BENCH  Summary

2n8 - src/react.bench.tsx > simple count
  1.01x faster than zustand
  1.03x faster than mobx
```

Run 3:

```
✓ src/react.bench.tsx > simple count 1890ms
    name          hz      min      max     mean      p75      p99     p995     p999     rme  samples
  · 2n8      74.5884  11.6642  16.5621  13.4069  13.6273  16.5621  16.5621  16.5621  ±1.81%       38
  · mobx     73.2655  11.6450  16.9816  13.6490  14.1171  16.9816  16.9816  16.9816  ±3.48%       37   slowest
  · zustand  74.8296  11.3695  16.7610  13.3637  14.3461  16.7610  16.7610  16.7610  ±3.23%       38   fastest

BENCH  Summary

zustand - src/react.bench.tsx > simple count
  1.00x faster than 2n8
  1.02x faster than mobx
```

## API

### `TwoAndEight`

The abstract class that all stores must extend if you would like to use the
following utility methods.

```ts
class Store extends TwoAndEight {
  // ...
}
```

#### Fields

Custom fields are your state, and should only be mutated in your actions.

#### Methods

Custom methods are your actions, and should be used to mutate state.

There are also some in-built actions. All in-built actions will always be
prefixed with a `$` to avoid clashing with your own action names.

##### `$emit`

```ts
$emit(): void
```

Emit to subscribers early instead of waiting until the end of the action. This
is useful in asynchronous actions where you may want subscribers to update
before the async event has finished.

```ts
class Store extends TwoAndEight {
  isFetching = false

  actionName = async () => {
    this.isFetching = true
    this.$emit()
    await fetchThing()
    this.isFetching = false
  }
}
```

##### `$reset`

```ts
$reset(stateName?: string): void
```

Call this to reset the state to its original value. Use a state name to reset a
single field of state, or call it without any arguments to reset _all_ state to
their original values.

```ts
this.$reset()
this.$reset('stateName')
```

```ts
class Store extends TwoAndEight {
  counter = 0

  resetCounter = () => {
    this.$reset('counter')
  }

  resetAll = () => {
    this.$reset()
  }
}
```

### `createReactStore`

```ts
createReactStore(store: Store extends TwoAndEight): useStore
```

Enhances a store instance, returning a React Hook with API utilities attached.
This should only be called _outside_ of components.

```ts
const useStore = createReactStore(new Store())

const Component = () => {
  const actionName = useStore('actionName')
  const stateName = useStore('stateName')
  // ...
}
```

#### `useStore.get`

```ts
useStore.get(field: Field): Store[Field]
```

Get any field or action of your store, useful in subscribers where hooks are not
available.

#### `useStore.subscribe`

```ts
useStore.subscribe(callback: () => void): () => void
```

Subscribes to state updates; registers a callback that fires whenever an action
emits. This can be used to trigger events when all or certain state changes.

```ts
useStore.subscribe(() => {
  writeCounterToFile(useStore.get('counter'))
})
```

Note that this will be called on every emitted state from the store. If you'd
like to optimise, it is advisable to use `if` statements and an external cache:

```ts
let counterCache = useStore.get('counter')

useStore.subscribe(() => {
  if (useStore.get('counter') !== counterCache) {
    writeCounterToFile(useStore.get('counter'))
    counterCache = useStore.get('counter')
  }
})
```

### `createStore`

```ts
createStore(store: Store extends TwoAndEight): store
```

This is the vanilla store creator used by `createReactStore`. You should only
need this if you are creating other, non-React, integrations with a 2n8 store.

#### `store.get`

```ts
useStore.get(field: Field): Store[Field]
```

Get any field or action of your store, useful in subscribers where hooks are not
available.

#### `store.subscribe`

```ts
store.subscribe(callback: () => void): () => void
```

Subscribes to state updates; registers a callback that fires whenever an action
emits. This can be used to trigger events when all or certain state changes.

#### `store.getInitialState`

```ts
store.getInitialState(): Store
```

Returns the initial state snapshot, before any mutations have occurred.
