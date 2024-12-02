import autoBind from 'auto-bind'
import { useSyncExternalStore } from 'react'

export class ClassyStore {
  #listeners: (() => void)[] = []

  constructor() {
    const p = new Proxy(this, {
      set: (_, key, value) => {
        const prevValue = Reflect.get(this, key)
        if (prevValue !== value) {
          Reflect.set(this, key, value)
          if (prevValue !== undefined && typeof prevValue !== 'function') {
            this.emitChange()
          }
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

  private emitChange = () => {
    for (const listener of this.#listeners) {
      listener()
    }
  }
}

export function createClassyStore<Store extends ClassyStore>(
  store: Store,
): <StoreField>(
  selector: (state: Omit<Store, '__getSnapshot' | '__subscribe'>) => StoreField,
) => StoreField {
  return (selector) =>
    useSyncExternalStore(store.__subscribe, () =>
      selector(store.__getSnapshot()),
    )
}
