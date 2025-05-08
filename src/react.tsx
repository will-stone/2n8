import { useSyncExternalStore } from 'react'

import type { TwoAndEight } from './2n8.js'
import { createStore } from './2n8.js'

export function createReactStore<Store extends TwoAndEight>(
  rawStore: Store,
): (<Field extends keyof Omit<Store, '$emit' | '$reset'>>(
  field: Field,
) => Store[Field]) & {
  store: Store
  subscribe: (subscriber: () => void) => () => void
} {
  const { getStateByField, store, subscribe } = createStore(rawStore)

  function useStore<Field extends keyof Store>(field: Field): Store[Field] {
    return useSyncExternalStore(
      subscribe,
      () => getStateByField(field),
      () => getStateByField(field),
    )
  }

  useStore.store = store
  useStore.subscribe = subscribe

  return useStore
}
