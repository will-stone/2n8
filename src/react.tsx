import { isEqual } from 'es-toolkit'
import { useSyncExternalStore } from 'react'

import type { TwoAndEight } from './2n8.js'
import { createStore } from './2n8.js'
import { clone } from './clone.js'

export function createReactStore<Store extends TwoAndEight>(
  rawStore: Store,
): (<Field extends keyof Omit<Store, '$emit' | '$reset'>>(
  field: Field,
) => Store[Field]) & {
  store: Store
  subscribe: (subscriber: () => void) => () => void
} {
  const { getInitialState, store, subscribe } = createStore(rawStore)

  const cache = {} as Store

  function useStore<Field extends keyof Store>(field: Field): Store[Field] {
    return useSyncExternalStore(
      subscribe,
      () => {
        const storedValue = store[field]
        const cachedValue = cache[field]

        if (typeof storedValue === 'function') {
          return storedValue
        }

        if (!isEqual(storedValue, cachedValue)) {
          cache[field] = clone(store[field])
        }

        return cache[field]
      },
      // @ts-expect-error -- Initial state doesn't (and shouldn't) include functions, but public selector API requires access to actions made by consumer.
      () => getInitialState()[field],
    )
  }

  useStore.store = store
  useStore.subscribe = subscribe

  return useStore
}
