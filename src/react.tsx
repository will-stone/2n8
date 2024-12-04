import { useSyncExternalStore } from 'react'

import type { TwoAndEight } from './2n8.js'

export function createStore<Store extends TwoAndEight>(
  store: Store,
): <StoreField>(
  selector: (state: Omit<Store, '__getSnapshot' | '__subscribe'>) => StoreField,
) => StoreField {
  return (selector) =>
    useSyncExternalStore(
      store.__subscribe,
      () => selector(store.__getSnapshot()),
      () => selector(store.__getSnapshot()),
    )
}
