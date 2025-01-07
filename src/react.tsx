import { isEqual } from 'es-toolkit'
import { useSyncExternalStore } from 'react'

import type { TwoAndEight } from './2n8.js'
import { createStore } from './2n8.js'
import { clone } from './clone.js'

export function createReactStore<Store extends TwoAndEight>(
  rawStore: Store,
): (<
  Field extends keyof Omit<
    Store,
    | '$emit'
    | '$getInitialState'
    | '$getSubscribersCount'
    | '$reset'
    | '$subscribe'
  >,
>(
  field: Field,
) => Store[Field]) & { store: Store } {
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
          cache[field] = clone(store[field])
        }

        return cache[field]
      },
      // @ts-expect-error -- Initial state doesn't (and shouldn't) include functions, but public selector API requires access to actions made by consumer.
      () => store.$getInitialState()[field],
    )
  }

  useStore.store = store

  return useStore
}
