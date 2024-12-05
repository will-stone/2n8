import { useSyncExternalStore } from 'react'

import type { TwoAndEight } from './2n8.js'

export function createStore<Store extends TwoAndEight>(
  store: Store,
): <StoreField>(
  selector: (state: Omit<Store, '$react' | '$subscribe'>) => StoreField,
) => StoreField {
  // eslint-disable-next-line unicorn/prefer-structured-clone
  const initialState = JSON.parse(JSON.stringify(store))
  return (selector) =>
    useSyncExternalStore(
      store.$subscribe,
      () => selector(store),
      () => selector(initialState),
    )
}
