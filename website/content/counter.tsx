import type { FC } from 'react'

import { TwoAndEight } from '../../src/2n8.js'
import { createStore } from '../../src/react.js'

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

const Counter: FC = () => {
  const count = useStore((state) => state.count)
  const addClicked = useStore((state) => state.addClicked)
  const resetClicked = useStore((state) => state.resetClicked)
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '3rem',
        }}
      >
        {count}
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          gap: '1rem',
          margin: 0,
        }}
      >
        <button
          onClick={addClicked}
          style={{
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
        >
          + 1
        </button>
        <button
          onClick={resetClicked}
          style={{
            marginTop: 0,
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default Counter
