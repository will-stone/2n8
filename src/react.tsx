import { cloneDeep, isEqual } from 'es-toolkit'
import { useSyncExternalStore } from 'react'

import type { State, TwoAndEight } from './2n8.js'
import { createStore } from './2n8.js'

export function createReactStore<Store extends TwoAndEight>(
  rawStore: Store,
): <Field>(
  selector: (
    state: Omit<
      Store,
      '$reset' | '$subscribe' | '$getState' | '$getInitialState'
    >,
  ) => Field,
) => Field {
  const store = createStore(rawStore)

  let cache: State<Store> = {} as State<Store>

  return (selector) =>
    useSyncExternalStore(
      store.$subscribe,
      () => {
        if (typeof selector(store) === 'function') {
          return selector(store)
        }

        const state = cloneDeep(store.$getState())
        if (!isEqual(cache, state)) {
          cache = state
        }

        return selector(cache)
      },
      // @ts-expect-error -- Initial state doesn't (and shouldn't) include functions, but public selector API requires access to actions made by consumer.
      () => selector(store.$getInitialState()),
    )
}
