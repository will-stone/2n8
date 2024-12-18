import { cloneDeep, isEqual } from 'es-toolkit'
import { useSyncExternalStore } from 'react'

import type { State, TwoAndEight } from './2n8.js'
import { createStore } from './2n8.js'

export function createReactStore<Store extends TwoAndEight>(
  rawStore: Store,
): (<Field>(
  selector: (state: Omit<Store, '$reset' | '$commit'>) => Field,
) => Field) & {
  subscribe: ReturnType<typeof createStore>['subscribe']
  getInitialState: ReturnType<typeof createStore>['getInitialState']
  getState: ReturnType<typeof createStore>['getState']
} {
  const store = createStore(rawStore)

  let cache = {} as State<Store>

  function hook<Field>(
    selector: (state: Omit<Store, '$reset' | '$commit'>) => Field,
  ): Field {
    return useSyncExternalStore(
      store.subscribe,
      () => {
        const state = store.getState()

        if (typeof selector(state) === 'function') {
          return selector(state)
        }

        if (!isEqual(cache, state)) {
          // @ts-expect-error -- The actions have already been removed above.
          cache = cloneDeep(state)
        }

        // @ts-expect-error -- selector expects functions (actions) but those have been dealt with above.
        return selector(cache)
      },
      // @ts-expect-error -- Initial state doesn't (and shouldn't) include functions, but public selector API requires access to actions made by consumer.
      () => selector(store.getInitialState()),
    )
  }

  hook.subscribe = store.subscribe
  hook.getInitialState = store.getInitialState
  hook.getState = store.getState

  return hook
}
