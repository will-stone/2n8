/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable unicorn/prefer-structured-clone */
import autoBind from 'auto-bind'
import { isEqual } from 'es-toolkit'

type State<Store> = {
  [K in keyof Store as Store[K] extends Function ? never : K]: Store[K]
}

export class TwoAndEight {
  #memoisedGetters: Record<string | symbol, unknown> = {}

  #initialState = {}

  #listeners: {
    callback: () => void
    selector?: <Field, T>(state: State<T>) => Field
  }[] = []

  constructor() {
    this.$subscribe = this.$subscribe.bind(this)
    this.$reset = this.$reset.bind(this)
    this.$getInitialState = this.$getInitialState.bind(this)
    this.$getState = this.$getState.bind(this)

    const p = new Proxy(this, {
      get(target, propertyKey, receiver) {
        const descriptor = Object.getOwnPropertyDescriptor(
          target.constructor.prototype,
          propertyKey,
        )

        // Check if the property is a getter
        if (descriptor && typeof descriptor.get === 'function') {
          const currentValue = Reflect.get(target, propertyKey, receiver)
          const memoisedValue = Reflect.get(
            target.#memoisedGetters,
            propertyKey,
          )

          if (
            !memoisedValue ||
            !isEqual(target.#memoisedGetters[propertyKey], currentValue)
          ) {
            Reflect.set(target.#memoisedGetters, propertyKey, currentValue)
          }

          return Reflect.get(target.#memoisedGetters, propertyKey)
        }

        return Reflect.get(target, propertyKey, receiver)
      },
      set: (_, key, value) => {
        const prevState = this.$getState()
        const prevValue = Reflect.get(this, key)
        // Always update value.
        Reflect.set(this, key, value)

        if (
          // Do not care about methods.
          typeof prevValue !== 'function'
        ) {
          // Store first value so it can be reset if required.
          const initialValue = Reflect.get(this.#initialState, key)
          if (initialValue === undefined) {
            Reflect.set(this.#initialState, key, prevValue)
          }
          const nextState = this.$getState()
          // Announce change.
          this.#emitChange(String(key), prevState, nextState)
        }

        return true
      },
    })

    autoBind(p)

    // eslint-disable-next-line no-constructor-return -- must be returned for getter memoizing to work.
    return p
  }

  $subscribe<Field>(
    callback: () => void,
    selector?: (state: State<this>) => Field,
  ) {
    // @ts-expect-error -- Types don't match but the public API is correct, and that's the important thing.
    this.#listeners = [...this.#listeners, { callback, selector }]
    return (): void => {
      const prevListenersCount = this.#listeners.length
      this.#listeners = this.#listeners.filter((l) => l.callback !== callback)
      const nextListenersCount = this.#listeners.length
      if (nextListenersCount >= prevListenersCount) {
        // eslint-disable-next-line no-console
        console.error("2n8: Listener wasn't removed on unsubscribe.")
      }
    }
  }

  $reset(field?: keyof this): void {
    if (field) {
      if (typeof this[field] === 'function') {
        throw new TypeError('2n8: Cannot reset a method.')
      }
      const prevState = this.$getState()
      const initialValue = Reflect.get(this.#initialState, field)
      if (initialValue !== undefined) {
        Reflect.set(this, field, initialValue)
        const nextState = this.$getState()
        this.#emitChange(String(field), prevState, nextState)
      }
    } else {
      for (const key of Object.keys(this.#initialState)) {
        const prevState = this.$getState()
        const initialValue = Reflect.get(this.#initialState, key)
        Reflect.set(this, key, initialValue)
        const nextState = this.$getState()
        this.#emitChange(key, prevState, nextState)
      }
    }
  }

  $getState(): State<this> {
    return JSON.parse(JSON.stringify(this))
  }

  $getInitialState(): State<this> {
    const currentState = this.$getState()
    return { ...currentState, ...this.#initialState }
  }

  #emitChange(
    key: string,
    prevState: Record<string, unknown>,
    nextState: Record<string, unknown>,
  ) {
    for (const listener of this.#listeners) {
      if (listener.selector) {
        if (listener.selector(prevState) !== listener.selector(nextState)) {
          listener.callback()
        }
      } else if (prevState[key] !== nextState[key]) {
        listener.callback()
      }
    }
  }
}
