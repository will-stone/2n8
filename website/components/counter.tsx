// store.ts
import { TwoAndEight, createReactStore } from '2n8'

class Store extends TwoAndEight {
  count = 0

  buttonClicked = () => {
    this.count++
  }
}

export const useStore = createReactStore(new Store())

// --------------------------------------------------

// Counter.tsx
export const Counter = () => {
  const count = useStore('count')
  const buttonClicked = useStore('buttonClicked')

  return (
    <>
      <span>{count}</span>
      <button onClick={buttonClicked}>👍</button>
    </>
  )
}
