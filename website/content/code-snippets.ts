export const twoAndEight = `import { TwoAndEight } from '2n8'
import { createStore } from '2n8/react'

class Store extends TwoAndEight {
  count = 0

  addClicked() {
    this.count = this.count + 1
  }

  resetClicked() {
    this.$reset('count')
  }
}

const useStore = createStore(new Store())

const Counter = () => {
  const count = useStore((s) => s.count)
  const addClicked = useStore((s) => s.addClicked)
  const resetClicked = useStore((s) => s.resetClicked)
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
