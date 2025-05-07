import autoBind from 'auto-bind'

function infuseWithCallbackAfterRun(
  fn: (...args: unknown[]) => unknown,
  cb: () => void,
) {
  return function infused(...args: unknown[]) {
    const result = fn.apply(fn, args)
    if (result instanceof Promise) {
      return result.finally(() => {
        cb()
      })
    }
    cb()
    return result
  }
}

export type State<Store> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof Store as Store[K] extends Function ? never : K]: Store[K]
}

export abstract class TwoAndEight {
  constructor(hasAutoBind?: boolean) {
    if (hasAutoBind) {
      autoBind(this)
    }
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
  store: Store
  subscribe: (subscriber: () => void) => () => void
} {
  const subscribers = new Set<() => void>()

  store.$emit = () => {
    for (const subscriber of subscribers) {
      subscriber()
    }
  }

  const initialState = {} as Store

  for (const [name, value] of Object.entries(store)) {
    if (typeof value !== 'function') {
      Reflect.set(initialState, name, structuredClone(value))
    }

    if (!name.startsWith('$')) {
      // Infuse all actions with an emit after they've run.
      if (typeof value === 'function') {
        Reflect.set(store, name, infuseWithCallbackAfterRun(value, store.$emit))
      }
      // Clone all fields to themselves so that external state isn't mutated.
      else if (typeof value !== 'function') {
        Reflect.set(store, name, structuredClone(value))
      }
    }
  }

  const getInitialState = () => structuredClone(initialState)

  store.$reset = (field?: keyof State<Store>): void => {
    if (field) {
      const value = Reflect.get(store, field)
      if (typeof value === 'function') {
        throw new TypeError('2n8: Cannot reset an action.')
      }
      const initialValue = getInitialState()[field]
      if (initialValue !== undefined) {
        Reflect.set(store, field, initialValue)
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

  const subscribe = (subscriber: () => void): (() => void) => {
    subscribers.add(subscriber)
    return () => subscribers.delete(subscriber)
  }

  return {
    getInitialState,
    store,
    subscribe,
  }
}
