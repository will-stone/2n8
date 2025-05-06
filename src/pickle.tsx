import { isEqual } from '@ver0/deep-equal'
import { produce } from 'immer'
import { useSyncExternalStore } from 'react'

/**
 * Simply returns what it's given, used for typing.
 */
export function id<T>(arg: T): T {
  return arg
}

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export function createBaseStore<
  State extends Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Events extends Record<string, (...args: any[]) => void>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Selectors extends Record<string, (state: State) => any> | undefined,
>(arg: {
  initialState: State
  events: (arg: {
    set: (fn: (state: State) => void) => void
    get: () => State
    reset: <FieldName extends keyof State>(fieldName?: FieldName) => void
  }) => Events
  selectors?: Selectors
  subscriptions?: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: State) => any,
    (api: {
      dispatch: <EventName extends keyof Events>(
        eventName: EventName,
        ...payload: Parameters<Events[EventName]>
      ) => void
      get: () => State
    }) => void,
  ][]
}): {
  dispatch: <EventName extends keyof Events>(
    eventName: EventName,
    ...payload: Parameters<Events[EventName]>
  ) => void
  subscribe: (
    subscriber: (previousState?: State, nextState?: State) => void,
  ) => () => void
  getSubscriberCount: () => number
  getInitialState: () => State
  getState: () => State
  getSelectorState: () =>
    | {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [K in keyof Selectors]: Record<K, any>
      }
    | undefined
} {
  const { initialState, events, selectors, subscriptions = [] } = arg

  const subscribers = new Set<
    (previousState?: State, nextState?: State) => void
  >()

  const subscribe = (
    subscriber: (previousState?: State, nextState?: State) => void,
  ): (() => void) => {
    subscribers.add(subscriber)
    return () => subscribers.delete(subscriber)
  }

  let state = initialState

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectorCache = {} as Record<keyof NonNullable<Selectors>, any>

  const selectorEntries = Object.entries(selectors || {}) as Entries<
    NonNullable<Selectors>
  >

  for (const [selectorName, selector] of selectorEntries) {
    selectorCache[selectorName] = selector(state)
  }

  function getState(): Readonly<State> {
    return state
  }

  function getInitialState(): Readonly<State> {
    return initialState
  }

  function getSelectorState() {
    return selectors ? selectorCache : undefined
  }

  function set(fn: (draft: State) => void) {
    const previousState = getState()
    state = produce(state, fn)
    for (const [selectorName, selector] of selectorEntries) {
      const previousSelectorValue = selectorCache[selectorName]
      const nextSelectorValue = selector(state)
      if (!isEqual(previousSelectorValue, nextSelectorValue)) {
        selectorCache[selectorName] = nextSelectorValue
      }
    }
    for (const subscriber of subscribers) {
      subscriber(previousState, state)
    }
  }

  function reset<FieldName extends keyof State>(fieldName?: FieldName) {
    set((currentState) => {
      if (fieldName) {
        currentState[fieldName] = structuredClone(initialState[fieldName])
        return
      }
      return structuredClone(initialState)
    })
  }

  function dispatch<EventName extends keyof Events>(
    eventName: EventName,
    ...payload: Parameters<Events[EventName]>
  ) {
    events({ get: getState, reset, set })[eventName](...payload)
  }

  // Set up subscriptions
  for (const subscription of subscriptions) {
    const [selector, subscriberCallback] = subscription
    subscribe((previousState, nextState) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const previousValue = selector(previousState!)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const nextValue = selector(nextState!)
      if (!isEqual(previousValue, nextValue)) {
        subscriberCallback({ dispatch, get: getState })
      }
    })
  }

  return {
    dispatch,
    getInitialState,
    getSelectorState,
    getState,
    getSubscriberCount: () => subscribers.size,
    subscribe,
  }
}

export function createStore<
  State extends Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Events extends Record<string, (...args: any[]) => void>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Selectors extends Record<string, (state: State) => any> | undefined,
>(arg: {
  initialState: State
  events: (arg: {
    set: (fn: (state: State) => void) => void
    get: () => State
    reset: <FieldName extends keyof State>(fieldName?: FieldName) => void
  }) => Events
  selectors?: Selectors
  subscriptions?: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: State) => any,
    (api: {
      dispatch: <EventName extends keyof Events>(
        eventName: EventName,
        ...payload: Parameters<Events[EventName]>
      ) => void
      get: () => State
    }) => void,
  ][]
}): {
  useDispatch: <EventName extends keyof Events>(
    eventName: EventName,
  ) => (...payload: Parameters<Events[EventName]>) => void
  useStore: <Field extends keyof State>(field: Field) => State[Field]
  useSelector: Selectors extends undefined
    ? undefined
    : <SelectorName extends keyof Selectors>(
        selectorName: SelectorName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) => Selectors[SelectorName] extends (state: any) => infer R ? R : never
  getSubscriberCount: () => number
} {
  const { selectors } = arg

  const {
    dispatch,
    subscribe,
    getState,
    getInitialState,
    getSelectorState,
    getSubscriberCount,
  } = createBaseStore(arg)

  return {
    useDispatch:
      (eventName) =>
      (...payload) => {
        dispatch(eventName, ...payload)
      },

    useStore: (field) => {
      return useSyncExternalStore(
        subscribe,
        () => getState()[field],
        () => getInitialState()[field],
      )
    },

    useSelector: (selectors
      ? (selectorName: keyof Selectors) => {
          return useSyncExternalStore(
            subscribe,
            () => getSelectorState()?.[selectorName],
            () => getSelectorState()?.[selectorName],
          )
        }
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Casting used here as not sure what the correct type is to match function declaration. It works as intended for the consumer though.
        undefined) as any,

    getSubscriberCount,
  }
}
