import { isEqual } from 'es-toolkit'
import { useSyncExternalStore } from 'react'
import clone from 'rfdc'

const cloneDeep = clone()

import type { State, TwoAndEight } from './2n8.js'
import { createStore } from './2n8.js'

export function createReactStore<Store extends TwoAndEight>(
  rawStore: Store,
): (<Field extends keyof Store>(field: Field) => Store[Field]) & {
  $subscribe: (callback: () => void) => () => void
  $getSubscribersCount: () => number
  $getInitialState: () => State<Store>
} {
  const store = createStore(rawStore)

  const cache = {} as Store

  function useStore<Field extends keyof Store>(field: Field): Store[Field] {
    return useSyncExternalStore(
      store.$subscribe,
      () => {
        const storedValue = store[field]
        const cachedValue = cache[field]

        if (typeof storedValue === 'function') {
          return storedValue
        }

        if (!isEqual(storedValue, cachedValue)) {
          cache[field] = cloneDeep(store[field])
        }

        return cache[field]
      },
      // @ts-expect-error -- Initial state doesn't (and shouldn't) include functions, but public selector API requires access to actions made by consumer.
      () => selector(store.getInitialState()),
    )
  }

  useStore.$subscribe = store.$subscribe
  useStore.$getInitialState = store.$getInitialState
  useStore.$getSubscribersCount = store.$getSubscribersCount

  return useStore
}
