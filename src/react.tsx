import { useSyncExternalStore } from 'react'

import type { Keys, State, TwoAndEight } from './2n8.js'

import { createStore } from './2n8.js'

export function createReactStore<Store extends TwoAndEight>(
  rawStore: Store,
): (<Key extends Keys<Store>>(key: Key) => Store[Key]) & {
  get: <Key extends Keys<Store>>(key: Key) => Store[Key]
  subscribe: (field: keyof State<Store>, subscriber: () => void) => () => void
} {
  const { get, subscribe } = createStore(rawStore)

  function useStore<Key extends Keys<Store>>(key: Key): Store[Key] {
    return useSyncExternalStore(
      (cb) =>
        typeof rawStore[key] === 'function'
          ? () => null
          : subscribe(
              // @ts-expect-error -- cannot subscribe to actions, as this point key=field.
              key,
              cb,
            ),
      () => get(key),
      () => get(key),
    )
  }

  useStore.get = get
  useStore.subscribe = subscribe

  return useStore
}
