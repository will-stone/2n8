// store.ts
import { createReactStore, TwoAndEight } from '2n8'

class Store extends TwoAndEight {
  count = 0

  addButtonClicked = () => {
    this.count++
  }

  resetButtonClicked = () => {
    this.$reset('count')
  }
}

export const useStore = createReactStore(new Store())

// Counter.tsx
export const Counter = () => {
  const count = useStore('count')
  const handleButtonClicked = useStore('addButtonClicked')
  const handleResetButtonClicked = useStore('resetButtonClicked')

  return (
    <>
      <span>{count}</span>
      <button onClick={handleButtonClicked}>👍</button>
      <button onClick={handleResetButtonClicked}>🔄</button>
    </>
  )
}
