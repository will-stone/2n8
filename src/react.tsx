import { cloneDeep, isEqual } from 'es-toolkit'
import { useSyncExternalStore } from 'react'

import type { State, TwoAndEight } from './2n8.js'
import { createStore } from './2n8.js'

export function createReactStore<Store extends TwoAndEight>(
  rawStore: Store,
): (<Field>(
  selector: (
    state: Omit<
      Store,
      '$reset' | '$subscribe' | '$getState' | '$getInitialState'
    >,
  ) => Field,
) => Field) & {
  $subscribe: Store['$subscribe']
  $commit: Store['$commit']
  $getInitialState: Store['$getInitialState']
  $getState: Store['$getState']
  $reset: Store['$reset']
} {
  const store = createStore(rawStore)

  let cache = {} as State<Store>

  function hook<Field>(
    selector: (
      state: Omit<
        Store,
        '$reset' | '$subscribe' | '$getState' | '$getInitialState'
      >,
    ) => Field,
  ): Field {
    return useSyncExternalStore(
      store.$subscribe,
      () => {
        if (typeof selector(store) === 'function') {
          return selector(store)
        }

        const state = cloneDeep(store.$getState())

        if (!isEqual(cache, state)) {
          cache = state
        }

        // @ts-expect-error -- selector expects functions (actions) but those have been dealt with above.
        return selector(cache)
      },
      // @ts-expect-error -- Initial state doesn't (and shouldn't) include functions, but public selector API requires access to actions made by consumer.
      () => selector(store.$getInitialState()),
    )
  }

  hook.$subscribe = store.$subscribe
  hook.$commit = store.$commit
  hook.$getInitialState = store.$getInitialState
  hook.$getState = store.$getState
  hook.$reset = store.$reset

  return hook
}
