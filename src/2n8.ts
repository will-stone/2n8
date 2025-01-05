import autoBind from 'auto-bind'

import { clone } from './clone.js'

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
  constructor() {
    autoBind(this)
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

  $subscribe(subscriber: () => void): () => void {
    // no-op, for now, it's enhanced in createStore
    // eslint-disable-next-line no-console
    console.log(subscriber)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {}
  }

  $getInitialState(): State<this> {
    // no-op, for now, it's enhanced in createStore
    return this
  }

  $getSubscribersCount(): number {
    return 0
  }
}

export function createStore<Store extends TwoAndEight>(store: Store): Store {
  const subscribers = new Set<() => void>()

  const emit = () => {
    for (const subscriber of subscribers) {
      subscriber()
    }
  }

  store.$emit = () => emit()

  const initialState = {} as Store

  for (const [name, value] of Object.entries(store)) {
    if (typeof value !== 'function') {
      Reflect.set(initialState, name, clone(value))
    }

    if (!name.startsWith('$')) {
      // Infuse all actions with an emit after they've run.
      if (typeof value === 'function') {
        Reflect.set(store, name, infuseWithCallbackAfterRun(value, emit))
      }
      // Clone all fields to themselves so that external state isn't mutated.
      else {
        Reflect.set(store, name, clone(value))
      }
    }
  }

  function getInitialState(): Store {
    return clone(initialState)
  }

  store.$getInitialState = getInitialState

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

  function subscribe(subscriber: () => void): () => void {
    subscribers.add(subscriber)
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

  store.$subscribe = subscribe

  // This is just for testing purposes really; nobody should really have to call this.
  const getSubscribersCount = () => subscribers.size

  store.$getSubscribersCount = getSubscribersCount

  return store
}
