import type { FC } from 'react'

import { createStore, TwoAndEight } from '../../src/index.js'

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
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          border: '8px solid #222429',
          borderRadius: '1rem',
          display: 'inline-flex',
          gap: '1rem',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '3rem',
            lineHeight: 1,
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
    </div>
  )
}

export default Counter
