import autoBind from 'auto-bind'

export class TwoAndEight {
  #initialState = {}

  #listeners: (() => void)[] = []

  constructor() {
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
          this.emitChange()
        }

        return true
      },
    })

    autoBind(p)
  }

  __subscribe = (listener: () => void) => {
    this.#listeners = [...this.#listeners, listener]
    return (): void => {
      this.#listeners = this.#listeners.filter((l) => l !== listener)
    }
  }

  __getSnapshot = (): this => {
    return this
  }

  $reset = (field?: keyof this): void => {
    if (field) {
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
    this.emitChange()
  }

  private emitChange = () => {
    for (const listener of this.#listeners) {
      listener()
    }
  }
}
