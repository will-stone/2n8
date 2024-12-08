/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable unicorn/prefer-structured-clone */
import autoBind from 'auto-bind'

export class TwoAndEight {
  #initialState = {}

  #listeners: {
    callback: () => void
    selector?: (state: unknown) => unknown
  }[] = []

  constructor() {
    this.$subscribe = this.$subscribe.bind(this)
    this.$reset = this.$reset.bind(this)
    this.$getInitialState = this.$getInitialState.bind(this)

    const p = new Proxy(this, {
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
  }

  $subscribe<StoreField>(
    callback: () => void,
    selector?: (state: {
      [K in keyof this as this[K] extends Function ? never : K]: this[K]
    }) => StoreField,
  ) {
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
    if (typeof this[field] === 'function') {
      throw new TypeError('2n8: Cannot reset a method.')
    }

    if (field) {
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

  $getState(): {
    [K in keyof this as this[K] extends Function ? never : K]: this[K]
  } {
    return JSON.parse(JSON.stringify(this))
  }

  $getInitialState(): {
    [K in keyof this as this[K] extends Function ? never : K]: this[K]
  } {
    const currentState = this.$getState()
    // @ts-expect-error -- returned type does match but TS doesn't like it.
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
