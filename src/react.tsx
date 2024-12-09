import { useSyncExternalStore } from 'react'

import type { TwoAndEight } from './2n8.js'

export function createStore<Store extends TwoAndEight>(
  store: Store,
): <Field>(
  selector: (
    state: Omit<
      Store,
      '$reset' | '$subscribe' | '$getState' | '$getInitialState'
    >,
  ) => Field,
) => Field {
  return (selector) =>
    useSyncExternalStore(
      store.$subscribe,
      () => selector(store),
      // @ts-expect-error -- Initial state doesn't (and shouldn't) include functions, but public selector API requires access to actions made by consumer.
      () => selector(store.$getInitialState()),
    )
}
