import { useSyncExternalStore } from 'react'

import type { TwoAndEight } from './2n8.js'

export function createStore<Store extends TwoAndEight>(
  store: Store,
): <StoreField>(
  selector: (
    state: Omit<
      Store,
      '$reset' | '$subscribe' | '$getState' | '$getInitialState'
    >,
  ) => StoreField,
) => StoreField {
  return (selector) =>
    useSyncExternalStore(
      store.$subscribe,
      () => selector(store),
      () => selector(store.$getInitialState()),
    )
}
