import autoBind from 'auto-bind'
import { cloneDeep, isEqual } from 'es-toolkit'

export type State<Store> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof Store as Store[K] extends Function ? never : K]: Store[K]
}

export abstract class TwoAndEight {
  constructor() {
    // Remove any references to set data.
    const p = new Proxy(this, {
      set(target, prop, value) {
        Reflect.set(target, prop, cloneDeep(value))
        return true
      },
    })

    autoBind(p)

    // eslint-disable-next-line no-constructor-return
    return p
  }

  $commit(): void {
    // no-op, for now, it's enhanced in createStore
  }

  $reset(field?: keyof this): void {
    // No-op: it's enhanced in createStore.

    // This doesn't really log anything, as the method is replaced in
    // createStore, it's just to allow the arg to be defined without an
    // underscore prefix.
    // eslint-disable-next-line no-console
    console.log(field)
  }
}

export function createStore<Store extends TwoAndEight>(
  store: Store,
): {
  getInitialState: () => State<Store>
  getState: () => Omit<Store, '$reset' | '$commit'>
  subscribe: <Field>(
    callback: () => void,
    selector?: (state: State<Store>) => Field,
  ) => () => void
} {
  // Clone all fields to themselves so that external state isn't mutated.
  for (const [name, value] of Object.entries(store)) {
    if (typeof value !== 'function' && !name.startsWith('$')) {
      Reflect.set(store, name, structuredClone(value))
    }
  }

  let listeners: {
    callback: () => void
    selector?: <Field>(state?: State<Store>) => Field
  }[] = []

  const commit = (prevState?: Store, nextState?: Store) => {
    for (const listener of listeners) {
      if (listener.selector) {
        if (
          !isEqual(listener.selector(prevState), listener.selector(nextState))
        ) {
          listener.callback()
        }
      } else {
        listener.callback()
      }
    }
  }

  store.$commit = () => commit()

  function getState(): Store {
    const state = {} as Store

    for (const [name, value] of Object.entries(store)) {
      Reflect.set(state, name, value)
    }

    // Capture getters by finding all getter methods
    for (const [propertyKey, descriptor] of Object.entries(
      Object.getOwnPropertyDescriptors(Object.getPrototypeOf(store)),
    )) {
      if (typeof descriptor.get === 'function') {
        try {
          const value = Reflect.get(store, propertyKey)
          Reflect.set(state, propertyKey, value)
        } catch {
          // Error retrieving getter
        }
      }
    }

    return state
  }

  // Infuse all actions with a commit after they've run.
  for (const [name, value] of Object.entries(store)) {
    if (typeof value === 'function' && !name.startsWith('$')) {
      Reflect.set(
        store,
        name,
        new Proxy(value, {
          apply(target, thisArg, args) {
            const prevState = getState()
            const result = target.apply(thisArg, args)
            if (result instanceof Promise) {
              return result.finally(() => {
                commit(prevState, getState())
              })
            }
            commit(prevState, getState())
            return result
          },
        }),
      )
    }
  }

  const initialState = {} as Store

  for (const [name, value] of Object.entries(store)) {
    Reflect.set(initialState, name, cloneDeep(value))
  }

  function getInitialState(): Store {
    return cloneDeep(initialState)
  }

  store.$reset = (field?: keyof State<Store>): void => {
    if (field) {
      const value = Reflect.get(store, field)
      if (typeof value === 'function') {
        throw new TypeError('2n8: Cannot reset an action.')
      }
      const initialValue = getInitialState()[field]
      if (initialValue !== undefined) {
        Reflect.set(store, field, initialValue)
        store[field] = initialValue
      }
    } else {
      for (const [key, initialValue] of Object.entries(getInitialState())) {
        // No need to reset functions.
        if (typeof initialValue !== 'function') {
          Reflect.set(store, key, initialValue)
        }
      }
    }
  }

  function subscribe<Field>(
    callback: () => void,
    selector?: (state: State<Store>) => Field,
  ): () => void {
    // @ts-expect-error -- Types don't match but the public API is correct, and that's the important thing.
    listeners = [...listeners, { callback, selector }]
    return (): void => {
      const prevListenersCount = listeners.length
      listeners = listeners.filter((listener) => listener.callback !== callback)
      const nextListenersCount = listeners.length
      if (nextListenersCount >= prevListenersCount) {
        // eslint-disable-next-line no-console
        console.error("2n8: Listener wasn't removed on unsubscribe.")
      }
    }
  }

  return {
    getInitialState,
    getState,
    subscribe,
  }
}
