import { useSyncExternalStore } from 'react'

import type {
  StateFieldsAndPublicActions,
  StateFields,
  TwoAndEight,
} from './2n8.js'
import { createStore } from './2n8.js'

export function createReactStore<Store extends TwoAndEight>(
  rawStore: Store,
): (<Field extends StateFieldsAndPublicActions<Store>>(
  field: Field,
) => Store[Field]) & {
  get: <Field extends StateFieldsAndPublicActions<Store>>(
    field: Field,
  ) => Store[Field]
  subscribe: <Field extends keyof StateFields<Store>>(
    field: Field,
    subscriber: () => void,
  ) => () => void
} {
  const { get, subscribe } = createStore(rawStore)

  function useStore<Field extends StateFieldsAndPublicActions<Store>>(
    field: Field,
  ): Store[Field] {
    return useSyncExternalStore(
      (cb) =>
        typeof rawStore[field] === 'function'
          ? () => null
          : subscribe(
              // @ts-expect-error -- cannot subscribe to actions.
              field,
              cb,
            ),
      () => get(field),
      () => get(field),
    )
  }

  useStore.get = get
  useStore.subscribe = subscribe

  return useStore
}
