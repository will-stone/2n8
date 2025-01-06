export const counter = `import { TwoAndEight, createReactStore } from '2n8'

class Store extends TwoAndEight {
  count = 0

  addClicked() {
    this.count++
  }

  resetClicked() {
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
}`

export const async = `import { TwoAndEight, createReactStore } from '2n8'

class Store extends TwoAndEight {
  status: 'idle' | 'pending' | 'success' = 'idle'

  async buttonClicked() {
    this.status = 'pending'
    this.$emit()
    await fetchData()
    this.status = 'success'
  }

  resetClicked() {
    this.$reset('status')
  }
}

const useStore = createReactStore(new Store())

const Async = () => {
  const status = useStore('status')
  const buttonClicked = useStore('buttonClicked')
  const resetClicked = useStore('resetClicked')
  return (
    <div>
      <button onClick={buttonClicked}>
        {status === 'idle' ? (
          <DownArrowIcon />
        ) : status === 'pending' ? (
          <SpinnerIcon />
        ) : (
          <DoneIcon />
        )}
      </button>
      <button onClick={resetClicked}>Reset</button>
    </div>
  )
}`

export const twoAndEightComments = `import { TwoAndEight, createReactStore } from '2n8'

// Classes work really nicely with TypeScript. This class is
// fully typed but there's no TypeScript syntax in sight!
class Store extends TwoAndEight {
  // Set your initial state. In this case the type
  // is also automatically inferred as \`number\`.
  count = 0

  // An action that can be called to modify state.
  addClicked() {
    this.count = this.count + 1
  }

  resetClicked() {
    // Built in reset mechanism means you don't
    // need to keep track of initial state.
    this.$reset('count')
  }
}

// Create the React hook.
const useStore = createReactStore(new Store())

const Counter = () => {
  // Use selectors to grab the required state and actions.
  // If you use the same one over-and-over, you can abstract
  // them to their own hooks, e.g. \`useCount()\`.
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
}`

export const zustand = `import { create } from 'zustand'

type State = {
  count: number
}

type Actions = {
  addClicked: () => void
  resetClicked: () => void
}

const initialState: State = {
  count: 0
}

const useStore = create<State & Actions>()((set) => ({
  ...initialState,
  addClicked: () => set((state) => ({ count: state.count + 1 })),
  resetClicked: () => set((state) => initialState),
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
}`
