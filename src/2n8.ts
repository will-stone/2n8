import autoBind from 'auto-bind'

export class TwoAndEight {
  #initialState = {}

  #listeners: (() => void)[] = []

  constructor() {
    this.$subscribe = this.$subscribe.bind(this)
    this.$reset = this.$reset.bind(this)
    this.$getInitialState = this.$getInitialState.bind(this)

    const p = new Proxy(this, {
      set: (_, key, value) => {
        const prevValue = Reflect.get(this, key)
        // Always update value.
        Reflect.set(this, key, value)

        if (
          // Value has changed.
          prevValue !== value &&
          // Do not care about methods.
          typeof prevValue !== 'function'
        ) {
          // Store first value so it can be reset if required.
          const initialValue = Reflect.get(this.#initialState, key)
          if (initialValue === undefined) {
            Reflect.set(this.#initialState, key, prevValue)
          }
          // Announce change.
          this.#emitChange()
        }

        return true
      },
    })

    autoBind(p)
  }

  $subscribe(listener: () => void) {
    this.#listeners = [...this.#listeners, listener]
    return (): void => {
      this.#listeners = this.#listeners.filter((l) => l !== listener)
    }
  }

  $reset(field?: keyof this): void {
    if (field) {
      if (typeof this[field] === 'function') {
        throw new TypeError('2n8: Cannot reset a method.')
      }
      const initialValue = Reflect.get(this.#initialState, field)
      if (initialValue !== undefined) {
        Reflect.set(this, field, initialValue)
      }
    } else {
      for (const key of Object.keys(this.#initialState)) {
        const initialValue = Reflect.get(this.#initialState, key)
        Reflect.set(this, key, initialValue)
      }
    }
    this.#emitChange()
  }

  $getInitialState(): Omit<
    this,
    '$getInitialState' | '$getState' | '$reset' | '$subscribe'
  > {
    return Object.fromEntries(
      Object.entries(this)
        .filter(([key]) => !key.startsWith('$'))
        .map(([key, value]) => {
          const initialValue = Reflect.get(this.#initialState, key)
          return [key, initialValue ?? value]
        }),
    ) as Omit<this, '$getInitialState' | '$getState' | '$reset' | '$subscribe'>
  }

  #emitChange() {
    for (const listener of this.#listeners) {
      listener()
    }
  }
}
