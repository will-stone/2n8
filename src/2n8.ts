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

  $reset(_field?: keyof this): void {
    // no-op, for now, it's enhanced in createStore
  }

  $subscribe<Field>(
    _callback: () => void,
    _selector?: (state: State<this>) => Field,
  ): () => void {
    // no-op, for now, it's enhanced in createStore
    return () => {
      //
    }
  }

  $getInitialState(): State<this> {
    // no-op, for now, it's enhanced in createStore
    return this
  }

  $getState(): State<this> {
    // no-op, for now, it's enhanced in createStore
    return this
  }
}

export function createStore<Store extends TwoAndEight>(
  store: Store,
): Store & {
  $getState: () => State<Store>
  $subscribe: (callback: () => void) => void
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

  const commit = (prevState?: State<Store>, nextState?: State<Store>) => {
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

  store.$commit = commit

  // Infuse all actions with a commit after they've run.
  for (const [name, value] of Object.entries(store)) {
    if (typeof value === 'function' && !name.startsWith('$')) {
      Reflect.set(
        store,
        name,
        new Proxy(value, {
          apply(target, thisArg, args) {
            const prevState = store.$getState()
            const result = target.apply(thisArg, args)
            if (result instanceof Promise) {
              return result.finally(() => {
                commit(prevState, store.$getState())
              })
            }
            commit(prevState, store.$getState())
            return result
          },
        }),
      )
    }
  }

  store.$getState = (): State<Store> => {
    const state = {} as State<Store>

    for (const [name, value] of Object.entries(store)) {
      if (typeof value !== 'function' && !name.startsWith('$')) {
        Reflect.set(state, name, value)
      }
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

  const initialState = {} as State<Store>

  for (const [name, value] of Object.entries(store)) {
    if (typeof value !== 'function' && !name.startsWith('$')) {
      Reflect.set(initialState, name, structuredClone(value))
    }
  }

  store.$getInitialState = () => structuredClone(initialState)

  store.$reset = (field?: keyof State<Store>): void => {
    const prevState = store.$getState()
    if (field) {
      const value = Reflect.get(store, field)
      if (typeof value === 'function') {
        throw new TypeError('2n8: Cannot reset a method.')
      }
      const initialValue = store.$getInitialState()[field]
      if (initialValue !== undefined) {
        store[field] = initialValue
        commit(prevState, store.$getState())
      }
    } else {
      for (const [key, initialValue] of Object.entries(
        store.$getInitialState(),
      )) {
        Reflect.set(store, key, initialValue)
        commit(prevState, store.$getState())
      }
    }
  }

  store.$subscribe = (callback, selector) => {
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

  return store
}
