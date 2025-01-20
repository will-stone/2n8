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

export const zustand = `import { create } from 'zustand'

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
}`

export const mobx = `import { observer } from 'mobx-react-lite'
import { makeAutoObservable } from "mobx"

type State = {
  count: number
}

const initialState: State = {
  count: 0
}

class Store {
  count = initialState.count

  constructor(savedState?: State) {
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
})`
