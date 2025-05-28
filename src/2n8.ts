import { isEqual } from '@ver0/deep-equal'

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

export type Keys<Store> = {
  [K in keyof Store]: K extends `$${string}` ? never : K
}[keyof Store]

export abstract class TwoAndEight {
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
  get: <Key extends Keys<Store>>(key: Key) => Store[Key]
  subscribe: <Field extends keyof State<Store>>(
    field: Field,
    subscriber: () => void,
  ) => () => void
} {
  const storeCache = {} as State<Store>

  const proto = Object.getPrototypeOf(store)

  const getterNames = Object.getOwnPropertyNames(proto).filter((name) => {
    const descriptor = Object.getOwnPropertyDescriptor(proto, name)
    return descriptor && typeof descriptor.get === 'function'
  })

  const stateNames = (Object.keys(store) as (keyof State<Store>)[]).filter(
    (key) => typeof store[key] !== 'function',
  )

  const fieldNames = [...getterNames, ...stateNames] as (keyof State<Store>)[]

  const subscribers = {} as Record<keyof State<Store>, Set<() => void>>

  for (const field of fieldNames) {
    storeCache[field] = structuredClone(store[field])
    subscribers[field] = new Set<() => void>()
  }

  store.$emit = () => {
    for (const field of fieldNames) {
      if (!isEqual(store[field], storeCache[field])) {
        storeCache[field] = structuredClone(store[field])
        for (const subscriber of subscribers[field]) {
          subscriber()
        }
      }
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

  store.$reset = (field?: keyof State<Store>): void => {
    if (field) {
      const value = Reflect.get(store, field)
      if (typeof value === 'function') {
        throw new TypeError('2n8: Cannot reset an action.')
      }
      if (getterNames.includes(field as string)) {
        throw new TypeError('2n8: Cannot reset derived state.')
      }
      const initialValue = initialState[field]
      if (initialValue !== undefined) {
        Reflect.set(store, field, structuredClone(initialValue))
      }
    } else {
      for (const [key, initialValue] of Object.entries(initialState)) {
        // No need to reset functions.
        if (typeof initialValue !== 'function') {
          Reflect.set(store, key, structuredClone(initialValue))
        }
      }
    }
  }

  const subscribe = <Field extends keyof State<Store>>(
    field: Field,
    subscriber: () => void,
  ): (() => void) => {
    subscribers[field]?.add(subscriber)
    return () => subscribers[field]?.delete(subscriber)
  }

  const get = <Key extends keyof Store>(key: Key) => {
    if (typeof store[key] === 'function') {
      return store[key]
    }

    // Pretending to be store because we've already removed actions above.
    return (storeCache as Store)[key]
  }

  return {
    get,
    subscribe,
  }
}
