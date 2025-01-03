import autoBind from 'auto-bind'
import { isEqual, isPlainObject } from 'es-toolkit'
import clone from 'rfdc'

const cloneDeep = clone()

export type State<Store> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof Store as Store[K] extends Function ? never : K]: Store[K]
}

function createDeepProxy<T extends object>(rootTarget: T) {
  const proxyHandler = {
    get(target: T, property: string) {
      const value = Reflect.get(target, property)
      // Handle nested objects/arrays recursively
      if (isPlainObject(value)) {
        return createDeepProxy(value)
      }

      return value
    },

    set(target: T, property: string, value: unknown) {
      Reflect.set(target, property, cloneDeep(value))
      return true
    },

    deleteProperty(target: T, property: string) {
      Reflect.deleteProperty(target, property)
      return true
    },
  }

  return new Proxy(rootTarget, proxyHandler)
}

export abstract class TwoAndEight {
  constructor() {
    // Remove any references to set data.
    const p = createDeepProxy(this)

    autoBind(p)

    // eslint-disable-next-line no-constructor-return
    return p
  }

  $emit(): void {
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
  getState: () => Omit<Store, '$reset' | '$emit'>
  subscribe: <Field>(
    subscriber: () => void,
    selector?: (state: State<Store>) => Field,
  ) => () => void
  getSubscribersCount: () => number
} {
  const subscribers = new Map<
    () => void,
    (<Field>(state?: State<Store>) => Field) | undefined
  >()

  const emit = (prevState?: Store, nextState?: Store) => {
    for (const [subscriber, selector] of subscribers) {
      if (selector) {
        if (!isEqual(selector(prevState), selector(nextState))) {
          subscriber()
        }
      } else {
        subscriber()
      }
    }
  }

  store.$emit = () => emit()

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

  const initialState = {} as Store

  for (const [name, value] of Object.entries(store)) {
    Reflect.set(initialState, name, cloneDeep(value))

    if (!name.startsWith('$')) {
      // Infuse all actions with an emit after they've run.
      if (typeof value === 'function') {
        Reflect.set(
          store,
          name,
          new Proxy(value, {
            apply(target, thisArg, args) {
              const prevState = getState()
              const result = target.apply(thisArg, args)
              if (result instanceof Promise) {
                return result.finally(() => {
                  emit(prevState, getState())
                })
              }
              emit(prevState, getState())
              return result
            },
          }),
        )
      }
      // Clone all fields to themselves so that external state isn't mutated.
      else {
        Reflect.set(store, name, cloneDeep(value))
      }
    }
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
    subscriber: () => void,
    selector?: (state: State<Store>) => Field,
  ): () => void {
    // @ts-expect-error -- Types don't match but the public API is correct, and that's the important thing.
    subscribers.set(subscriber, selector)
    return (): void => {
      const prevSubscribersCount = subscribers.size
      subscribers.delete(subscriber)
      const nextSubscribersCount = subscribers.size
      if (nextSubscribersCount >= prevSubscribersCount) {
        // eslint-disable-next-line no-console
        console.error("2n8: Subscriber wasn't removed on unsubscribe.")
      }
    }
  }

  // This is just for testing purposes really; nobody should really have to call this.
  const getSubscribersCount = () => subscribers.size

  return {
    getInitialState,
    getState,
    getSubscribersCount,
    subscribe,
  }
}
