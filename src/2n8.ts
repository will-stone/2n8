import autoBind from 'auto-bind'

export type State<Store> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof Store as Store[K] extends Function ? never : K]: Store[K]
}

export abstract class TwoAndEight {
  constructor() {
    autoBind(this)
  }

  $commit(): void {
    // no-op, for now, it's enhanced in createStore
  }

  $reset(_field?: keyof this): void {
    // no-op, for now, it's enhanced in createStore
  }

  $subscribe(_callback: () => void): void {
    // no-op, for now, it's enhanced in createStore
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
  let listeners: (() => void)[] = []

  const commit = () => {
    for (const listener of listeners) {
      listener()
    }
  }

  store.$commit = () => {
    commit()
  }

  for (const [name, value] of Object.entries(store)) {
    if (typeof value === 'function' && !name.startsWith('$')) {
      store[name] = new Proxy(value, {
        apply(target, thisArg, args) {
          const result = target.apply(thisArg, args)
          if (result instanceof Promise) {
            return result.then((asyncResult) => {
              // Wait for hook to complete if it returns a promise
              commit()
              return asyncResult
            })
          }
          commit()
          return result
        },
      })
    }
  }

  store.$getState = (): State<Store> => {
    const state = {} as Store

    for (const [name, value] of Object.entries(store)) {
      if (typeof value !== 'function' && !name.startsWith('$')) {
        state[name] = value
      }
    }

    // Capture getters by finding all getter methods
    for (const [propertyKey, descriptor] of Object.entries(
      Object.getOwnPropertyDescriptors(Object.getPrototypeOf(store)),
    )) {
      if (typeof descriptor.get === 'function') {
        try {
          const value = Reflect.get(store, propertyKey)
          // console.log(propertyKey, value)
          // Reflect.set(snapshot, propertyKey, value)
          state[propertyKey] = value
        } catch {
          // Error retrieving getter
        }
      }
    }

    return state
  }

  const initialState = {}

  for (const [name, value] of Object.entries(store)) {
    if (typeof value !== 'function' && !name.startsWith('$')) {
      initialState[name] = structuredClone(value)
    }
  }

  store.$getInitialState = () => initialState

  store.$reset = (field?: keyof Store): void => {
    if (field) {
      if (typeof store[field] === 'function') {
        throw new TypeError('2n8: Cannot reset a method.')
      }
      const initialValue = initialState[field]
      if (initialValue !== undefined) {
        store[field] = initialValue
        commit()
      }
    } else {
      for (const [key, initialValue] of Object.entries(initialState)) {
        store[key] = initialValue
        commit()
      }
    }
  }

  store.$subscribe = (callback) => {
    listeners = [...listeners, callback]
    return (): void => {
      const prevListenersCount = listeners.length
      listeners = listeners.filter((cb) => cb !== callback)
      const nextListenersCount = listeners.length
      if (nextListenersCount >= prevListenersCount) {
        // eslint-disable-next-line no-console
        console.error("2n8: Listener wasn't removed on unsubscribe.")
      }
    }
  }

  return store
}
