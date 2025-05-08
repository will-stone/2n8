import { useSyncExternalStore } from 'react'

import type { TwoAndEight } from './2n8.js'
import { createStore } from './2n8.js'

export function createReactStore<Store extends TwoAndEight>(
  rawStore: Store,
): (<Field extends keyof Omit<Store, '$emit' | '$reset'>>(
  field: Field,
) => Store[Field]) & {
  get: <Field extends keyof Omit<Store, '$emit' | '$reset'>>(
    field: Field,
  ) => Store[Field]
  subscribe: (subscriber: () => void) => () => void
} {
  const { get, subscribe } = createStore(rawStore)

  function useStore<Field extends keyof Store>(field: Field): Store[Field] {
    return useSyncExternalStore(
      subscribe,
      () => get(field),
      () => get(field),
    )
  }

  useStore.get = get
  useStore.subscribe = subscribe

  return useStore
}
