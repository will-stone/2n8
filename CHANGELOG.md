# Changelog

## [0.19.6](https://github.com/will-stone/2n8/compare/0.19.5...0.19.6) (2025-06-03)

### Patches

- Add size of package to key features
  ([9989dc4](https://github.com/will-stone/2n8/commit/9989dc40eb2acd2b662cc4297c2acca2cf5a7b1e))

## [0.19.5](https://github.com/will-stone/2n8/compare/0.19.4...0.19.5) (2025-06-03)

### Patches

- Update bundle size docs
  ([2a33ab8](https://github.com/will-stone/2n8/commit/2a33ab89ef7dd43e2f0e3e2ab9bd53a7e7dbb8f2))

## [0.19.4](https://github.com/will-stone/2n8/compare/0.19.3...0.19.4) (2025-06-03)

### Patches

- Change build tool from Vite to tsdown
  ([70b7475](https://github.com/will-stone/2n8/commit/70b74756748076504324b0521a402c78a6ac5881))

## [0.19.3](https://github.com/will-stone/2n8/compare/0.19.2...0.19.3) (2025-05-29)

### Patches

- Update docs with Keys and State types
  ([db60c27](https://github.com/will-stone/2n8/commit/db60c272753204a176b548baa9d7dd2c6f926121))

## [0.19.2](https://github.com/will-stone/2n8/compare/0.19.1...0.19.2) (2025-05-28)

### Patches

- Refactor out one loop
  ([1e5d4aa](https://github.com/will-stone/2n8/commit/1e5d4aa24d4406e289955e943c98b43d90baa001))
- Export Keys and State
  ([6067e94](https://github.com/will-stone/2n8/commit/6067e94755030208f35c739498bb66cbf6a4bbbf))

  Docs required: Keys = any state, derived, or action name. State = only state
  and their values.

## [0.19.1](https://github.com/will-stone/2n8/compare/0.19.0...0.19.1) (2025-05-26)

### Patches

- Fix handle retrieval of field that doesn't exist
  ([588e19b](https://github.com/will-stone/2n8/commit/588e19b1a4677b98d842f9f76404fea7dfed82bd))

## [0.19.0](https://github.com/will-stone/2n8/compare/0.18.4...0.19.0) (2025-05-14)

### Minor changes

- Subscriptions are now tracked by field
  ([2d0e483](https://github.com/will-stone/2n8/commit/2d0e48395d9b50b33cf54d34384daf7770d20df3))

  This means subscriptions will not fire if the thing they are tracking hasn't
  changed.

This has also had an affect on when state officially changes which is now only
after an emit.

## [0.18.4](https://github.com/will-stone/2n8/compare/0.18.3...0.18.4) (2025-05-14)

### Patches

- Simplify get internals slightly
  ([936ce0a](https://github.com/will-stone/2n8/commit/936ce0a31bf7914513346e6d1fedaff6df9616f6))

## [0.18.3](https://github.com/will-stone/2n8/compare/0.18.2...0.18.3) (2025-05-13)

### Patches

- Document and test emit-less actions
  ([dcb4cf4](https://github.com/will-stone/2n8/commit/dcb4cf441d91820847141d69c3cc41c0ded053c1))

## [0.18.2](https://github.com/will-stone/2n8/compare/0.18.1...0.18.2) (2025-05-08)

### Patches

- Remove auto-bind from deps and docs
  ([6f87025](https://github.com/will-stone/2n8/commit/6f870256d235454ca7d2f20ff958379e5c78a159))

## [0.18.1](https://github.com/will-stone/2n8/compare/0.18.0...0.18.1) (2025-05-08)

### Patches

- Rename getStateByField to simply get
  ([88c0edb](https://github.com/will-stone/2n8/commit/88c0edbac21ec5d7d1d2143582935f9433f390a7))
- Update README with updated API
  ([3b36da7](https://github.com/will-stone/2n8/commit/3b36da7ad04cd98f29494d145206d4f8aff442c4))

## [0.18.0](https://github.com/will-stone/2n8/compare/0.17.0...0.18.0) (2025-05-08)

### Minor changes

- Remove store from API
  ([0bfcba0](https://github.com/will-stone/2n8/commit/0bfcba0a12db63bcb6d620bdd2e78a2acd2f0d81))

## [0.17.0](https://github.com/will-stone/2n8/compare/0.16.1...0.17.0) (2025-05-08)

### Minor changes

- Replace getInitialState with getStateByField
  ([d785417](https://github.com/will-stone/2n8/commit/d78541741902baf08c5e71e33573a4ed7a8d554f))

## [0.16.1](https://github.com/will-stone/2n8/compare/0.16.0...0.16.1) (2025-05-07)

### Patches

- Update README with latest bundle size
  ([985f675](https://github.com/will-stone/2n8/commit/985f675d0ef77c1f20f83c1db3dd45584aac9bef))

## [0.16.0](https://github.com/will-stone/2n8/compare/0.15.0...0.16.0) (2025-05-07)

### Minor changes

- Remove auto-bind
  ([6072d89](https://github.com/will-stone/2n8/commit/6072d899438d2e2f95d07927a4f6a2d5dd3c427b))

### Patches

- Update README with non-auto-bound methods
  ([0233581](https://github.com/will-stone/2n8/commit/02335813a1b8fd7ba8bbb598b1dbb045d184cfed))

## [0.15.0](https://github.com/will-stone/2n8/compare/0.14.0...0.15.0) (2025-05-07)

### Minor changes

- Make auto-bind optional
  ([4e861f7](https://github.com/will-stone/2n8/commit/4e861f7a7e3a07f8932c19c0c9e7a7d70c5eb726))

## [0.14.0](https://github.com/will-stone/2n8/compare/0.13.4...0.14.0) (2025-05-07)

### Minor changes

- Remove Pickle (the new API)
  ([17b733e](https://github.com/will-stone/2n8/commit/17b733ed351f2e278f2d26c5efcb771d92f69c93))

  Didn't work.

## [0.13.4](https://github.com/will-stone/2n8/compare/0.13.3...0.13.4) (2025-05-06)

### Patches

- Forgot to export id
  ([022262c](https://github.com/will-stone/2n8/commit/022262c26f1a4288cb77defbc4ed646c8b056738))

## [0.13.3](https://github.com/will-stone/2n8/compare/0.13.2...0.13.3) (2025-05-06)

### Patches

- Add id function
  ([c58892c](https://github.com/will-stone/2n8/commit/c58892cc490819e4b5b0d1c88baea1ef2fa7c51e))

## [0.13.2](https://github.com/will-stone/2n8/compare/0.13.1...0.13.2) (2025-05-06)

### Patches

- Completely different API! Zustand meets Redux meets Pinia
  ([d22d8ca](https://github.com/will-stone/2n8/commit/d22d8caf0e695ed6461b6e7fae7d9bbeeb46a94c))

  This is a complete change to the API. I got fed up of dealing with classes and
  `this` 😱 Much more fun to play with functional! This is essentially Zustand
  but how _I_ would have built it 🤓 Immer is built in, actions are called
  events (as they should be), and selectors are moved to the store. This is
  going out as a patch, living next to the original 2n8 until I've tested it in
  projects.

## [0.13.1](https://github.com/will-stone/2n8/compare/0.13.0...0.13.1) (2025-04-19)

### Patches

- Add link to name background
  ([7bcd3f6](https://github.com/will-stone/2n8/commit/7bcd3f671db6b035cb237e4cb7e8f7186ca231e5))

## [0.13.0](https://github.com/will-stone/2n8/compare/0.12.2...0.13.0) (2025-04-19)

### Minor changes

- ESM only
  ([63752cd](https://github.com/will-stone/2n8/commit/63752cda768753c9510ba377c7bdfde0ad477ef7))

## [0.12.2](https://github.com/will-stone/2n8/compare/0.12.1...0.12.2) (2025-04-19)

### Patches

- Move docs to README, no more website
  ([9c2e7fb](https://github.com/will-stone/2n8/commit/9c2e7fb40b2bbfb5b5be8857fc339c1b0e956615))
- Fix deps getting bundled in build
  ([70749f1](https://github.com/will-stone/2n8/commit/70749f1a0d808eae324cfe6c3ebeeec64b32321a))

## [0.12.1](https://github.com/will-stone/2n8/compare/0.12.0...0.12.1) (2025-04-13)

### Patches

- Fix custom auto-binding not working
  ([22a6667](https://github.com/will-stone/2n8/commit/22a666715bcfa93d6260e9db15c1a6186422544f))

## [0.12.0](https://github.com/will-stone/2n8/compare/0.11.0...0.12.0) (2025-04-13)

### Minor changes

- Use structuredClone instead of rfdc
  ([4a65e21](https://github.com/will-stone/2n8/commit/4a65e211be506460d9d09b53e7d11eb57fc98e4e))
- Use structuredClone instead of rfdc
  ([59b1b3e](https://github.com/will-stone/2n8/commit/59b1b3e6b5059c127f75bbb14ffc4108daa165c1))

## [0.11.0](https://github.com/will-stone/2n8/compare/0.10.3...0.11.0) (2025-04-10)

### Minor changes

- Refactor auto-binding
  ([1d8903c](https://github.com/will-stone/2n8/commit/1d8903cfec39f0e1323f5c91419e3102f9edde23))
- Refactor auto-binding
  ([4840377](https://github.com/will-stone/2n8/commit/4840377fbc648e1062165146e07cf6c1557d544a))

## [0.10.3](https://github.com/will-stone/2n8/compare/0.10.2...0.10.3) (2025-04-10)

### Patches

- Swap fast-equals for @ver0/deep-equal
  ([9e4e359](https://github.com/will-stone/2n8/commit/9e4e3593bbcb55adc350977de154212cb834b91f))

## [0.10.2](https://github.com/will-stone/2n8/compare/0.10.1...0.10.2) (2025-01-21)

### Patches

- Add emoji-logo to README title
  ([248faeb](https://github.com/will-stone/2n8/commit/248faeb31690a7955995bbdc5cdff6bacea5af4a))

## [0.10.1](https://github.com/will-stone/2n8/compare/0.10.0...0.10.1) (2025-01-20)

### Patches

- Replace equality checker package for a faster one
  ([dcf68d9](https://github.com/will-stone/2n8/commit/dcf68d9ceddce3aca42d084462037aff8d8055cc))

## [0.10.0](https://github.com/will-stone/2n8/compare/0.9.1...0.10.0) (2025-01-20)

### Minor changes

- Remove unused API method: getSubscribersCount
  ([da94d77](https://github.com/will-stone/2n8/commit/da94d770c57ea1138248b5373a2f0c110b7ab566))

## [0.9.1](https://github.com/will-stone/2n8/compare/0.9.0...0.9.1) (2025-01-20)

### Patches

- Do not bundle rfdc
  ([2413bf7](https://github.com/will-stone/2n8/commit/2413bf79d8096a42fbfca9ecb85d51063e2e9034))
- Remove unused dep
  ([6e68181](https://github.com/will-stone/2n8/commit/6e68181381c102caf63cbc702a3c37284ce78955))

## [0.9.0](https://github.com/will-stone/2n8/compare/0.8.3...0.9.0) (2025-01-20)

### Minor changes

- Export API from create function rather than off the store class
  ([5561a49](https://github.com/will-stone/2n8/commit/5561a49015595d41a8a65735a5cb947e47eacdcb))

## [0.8.3](https://github.com/will-stone/2n8/compare/0.8.2...0.8.3) (2025-01-12)

### Patches

- Test release
  ([2f23d6b](https://github.com/will-stone/2n8/commit/2f23d6b1c223583c13dfae5a6fb17e776a7e9c6a))

## [0.8.2](https://github.com/will-stone/2n8/compare/0.8.1...0.8.2) (2025-01-07)

### Patches

- Fix initial state being mutated
  ([eead54d](https://github.com/will-stone/2n8/commit/eead54dd7d29fb3d15e786eafa57e7d2da53eab6))

## [0.8.1](https://github.com/will-stone/2n8/compare/0.8.0...0.8.1) (2025-01-07)

### Patches

- Expose store on useStore
  ([a93a31c](https://github.com/will-stone/2n8/commit/a93a31c5d63b735743210fafef3a627fc423dfb3))

## [0.8.0](https://github.com/will-stone/2n8/compare/0.7.7...0.8.0) (2025-01-06)

### Minor changes

- Stop using proxies as they are slow
  ([a284ab1](https://github.com/will-stone/2n8/commit/a284ab1b9077eb6f7883f18997e86b23b3d89f47))

### Patches

- Remove internal API from React field selectors
  ([64fb7e9](https://github.com/will-stone/2n8/commit/64fb7e90fb8601f9fdce0ebf73105cc966311bb4))
- Re-export clone utility
  ([a6d8139](https://github.com/will-stone/2n8/commit/a6d81399aa47e2d317cdf9dd9eeab15717cf5583))

## [0.7.7](https://github.com/will-stone/2n8/compare/0.7.6...0.7.7) (2025-01-04)

### Patches

- Remove duplicate set in reset
  ([c527383](https://github.com/will-stone/2n8/commit/c527383f297f6fe5b7acb16ece0d84c0e1a885fa))

## [0.7.6](https://github.com/will-stone/2n8/compare/0.7.5...0.7.6) (2025-01-04)

### Patches

- Speed up getState, slightly
  ([37214fd](https://github.com/will-stone/2n8/commit/37214fd5441a1486a6068de379d49c421c9f150f))

## [0.7.5](https://github.com/will-stone/2n8/compare/0.7.4...0.7.5) (2025-01-04)

### Patches

- Speed up getState, slightly
  ([12696e5](https://github.com/will-stone/2n8/commit/12696e56249862402cf58a35c28bbb2f0d80f257))

## [0.7.4](https://github.com/will-stone/2n8/compare/0.7.3...0.7.4) (2025-01-04)

### Patches

- Use faster deep equals
  ([805ce0c](https://github.com/will-stone/2n8/commit/805ce0caee3928eaf7b5a25991bef3371e7efec5))

## [0.7.3](https://github.com/will-stone/2n8/compare/0.7.2...0.7.3) (2025-01-03)

### Patches

- Speed up internal cloning
  ([81f5fa7](https://github.com/will-stone/2n8/commit/81f5fa7a1d2545672753bcb388a4e935360f65cf))

## [0.7.2](https://github.com/will-stone/2n8/compare/0.7.0...0.7.2) (2025-01-03)

### Patches

- Prevent mutating external objects on nested object state
  ([b31d1b5](https://github.com/will-stone/2n8/commit/b31d1b51425a6109e27b3eaa109e5ee873b0ff3d))
- Refactor-out multiple loops over the same object
  ([4913d84](https://github.com/will-stone/2n8/commit/4913d84e3dbefb46f8f874943a77ba3515ba7e9f))

## [0.7.0](https://github.com/will-stone/2n8/compare/0.6.0...0.7.0) (2025-01-02)

### Minor changes

- Change listeners to subscribers
  ([4642a62](https://github.com/will-stone/2n8/commit/4642a62dd2f67273f30ceeaa45e3564a99a42220))

## [0.6.0](https://github.com/will-stone/2n8/compare/0.5.4...0.6.0) (2025-01-02)

### Minor changes

- Change special $commit action to $emit, to better represent what it does
  ([468c725](https://github.com/will-stone/2n8/commit/468c72591d563763c370eaeaa432ae1376666f45))

### Patches

- Add getListenersCount
  ([a7e78c4](https://github.com/will-stone/2n8/commit/a7e78c45255fee480aea0d43dbc2fcbe6cfb49cc))
- Set React as an optional peerDep
  ([231634d](https://github.com/will-stone/2n8/commit/231634dd5308cfca25c4d298c451dc5596d2614d))

## [0.5.4](https://github.com/will-stone/2n8/compare/0.5.3...0.5.4) (2024-12-18)

### Patches

- Improve npm README and fields
  ([f6eaf4a](https://github.com/will-stone/2n8/commit/f6eaf4a6a2b8a456c8fffc2df15e5d7ef93c9536))

## [0.5.3](https://github.com/will-stone/2n8/compare/0.5.2...0.5.3) (2024-12-18)

### Patches

- Internal refactor to fix lint issues
  ([159a5d6](https://github.com/will-stone/2n8/commit/159a5d67105be9ffe03cd89c1149506d0bd7fff1))
- Fix autoBind error in CJS envs
  ([5315e73](https://github.com/will-stone/2n8/commit/5315e736d8fa1ecd437c58a60183d235e6be8a0e))

## [0.5.2](https://github.com/will-stone/2n8/compare/0.5.1...0.5.2) (2024-12-18)

### Patches

- Add compatibility with React 19
  ([3ff8413](https://github.com/will-stone/2n8/commit/3ff841370dcee6f309a5810fd1ece6e2deb3520d))

## [0.5.1](https://github.com/will-stone/2n8/compare/0.5.0...0.5.1) (2024-12-18)

### Patches

- Fix types on createReactStore returned utils
  ([fcc6155](https://github.com/will-stone/2n8/commit/fcc6155fdd6668b2eca6a89d5c376fa3e0cb52d5))
- Refactor to use consistent internal store set
  ([c0a2e42](https://github.com/will-stone/2n8/commit/c0a2e420d7741eb07844780f94a41e1243bffeb3))

## [0.5.0](https://github.com/will-stone/2n8/compare/0.4.0...0.5.0) (2024-12-18)

### Minor changes

- Remove direct access to fields
  ([cc1d3e3](https://github.com/will-stone/2n8/commit/cc1d3e3eb38830286b44a0d9ad593987adda7765))

## [0.4.0](https://github.com/will-stone/2n8/compare/0.3.4...0.4.0) (2024-12-18)

### Minor changes

- Change to a commit-based flow
  ([d459837](https://github.com/will-stone/2n8/commit/d459837bc1ff62e6939011dd45d15be58058df6c))

### Patches

- Attach vanilla API to React hook
  ([25a1d36](https://github.com/will-stone/2n8/commit/25a1d368faf880ebc68ea8114d86485ca7660766))
- Do not mutate external objects
  ([f62f3a3](https://github.com/will-stone/2n8/commit/f62f3a3f10f1f9f8c4ca8b790c740cea46d5a744))
- Always commit changes
  ([c1734f5](https://github.com/will-stone/2n8/commit/c1734f5abf1c783182e95b6982128b66a13b5a59))
- Prevent changes to initial state
  ([626ec28](https://github.com/will-stone/2n8/commit/626ec28b9de4633b5c9b6973fff1bb37600ef202))
- Prevent mutation of external objects when setting up state
  ([a9d0bd0](https://github.com/will-stone/2n8/commit/a9d0bd0e2753f92715792fb0bcca8e2b52a16e60))

## [0.3.4](https://github.com/will-stone/2n8/compare/0.3.3...0.3.4) (2024-12-11)

### Patches

- Fixed unchanged objects causing subscriptions to fire
  ([663582a](https://github.com/will-stone/2n8/commit/663582a958305e42e060f993cbd2308de7bccf65))

## [0.3.3](https://github.com/will-stone/2n8/compare/0.3.2...0.3.3) (2024-12-11)

### Patches

- Fix subscriptions not firing with derived state
  ([92f067a](https://github.com/will-stone/2n8/commit/92f067afa6bbc18159675316979a8a8d72b7c5be))

## [0.3.2](https://github.com/will-stone/2n8/compare/0.3.1...0.3.2) (2024-12-10)

### Patches

- Fix memoizing derived not working (again)
  ([2756ba8](https://github.com/will-stone/2n8/commit/2756ba80e3b905e7cad116310b045c9e2a8b132f))

## [0.3.1](https://github.com/will-stone/2n8/compare/0.3.0...0.3.1) (2024-12-10)

### Patches

- Fix derived getters causing infinite loops in React
  ([132d94e](https://github.com/will-stone/2n8/commit/132d94e96c30ab6812f7a91271603f338f4fa7fc))

## [0.3.0](https://github.com/will-stone/2n8/compare/0.2.5...0.3.0) (2024-12-09)

### Minor changes

- Export all from index for one less line of code
  ([1d0bae9](https://github.com/will-stone/2n8/commit/1d0bae9f1c29d3578f907cfb067b5e4f84383170))

### Patches

- Add $getState
  ([1b08e2d](https://github.com/will-stone/2n8/commit/1b08e2d092eecbeb9f486ffe1ffd9b14d313e56f))
- Only return state from $getInitialState
  ([887987c](https://github.com/will-stone/2n8/commit/887987c3c93efb2a6615b15e9750d3c24a0202da))
- Add subscribe with a selector
  ([2f3139f](https://github.com/will-stone/2n8/commit/2f3139f4208bdce3e006d7c8e8cf75af3cca03cb))

## [0.2.5](https://github.com/will-stone/2n8/compare/0.2.4...0.2.5) (2024-12-07)

### Patches

- Removed getState
  ([2815607](https://github.com/will-stone/2n8/commit/2815607db75f5aa8eac87cb4a18eb688cbdeaeb5))

## [0.2.4](https://github.com/will-stone/2n8/compare/0.2.3...0.2.4) (2024-12-06)

### Patches

- Remove API methods from React hook
  ([69163c2](https://github.com/will-stone/2n8/commit/69163c24d620f9069a52681c8aed69b7e812eb56))
- Add $getState method
  ([06afbc9](https://github.com/will-stone/2n8/commit/06afbc98ff5b9ec4207df02daa9174e33ac8edd3))
- Add $getInitialState method
  ([7c9caba](https://github.com/will-stone/2n8/commit/7c9caba70481a65cdeb3338b83a203540002b128))

## [0.2.3](https://github.com/will-stone/2n8/compare/0.2.2...0.2.3) (2024-12-05)

### Patches

- Show $ methods as methods in IDE
  ([197fe56](https://github.com/will-stone/2n8/commit/197fe5644d189b51391b2b914b0fef16549608bc))
- Hide emitChange method as it's an internal method
  ([d63ec4b](https://github.com/will-stone/2n8/commit/d63ec4bdbb417ef954e9a954e925b5d7ec930ce6))

## [0.2.2](https://github.com/will-stone/2n8/compare/0.2.1...0.2.2) (2024-12-05)

### Patches

- Provide initial state to server snapshot of React store
  ([cec5da1](https://github.com/will-stone/2n8/commit/cec5da120e98b935e59dbb0096d5d3f6dcd7e371))
- Throw if attempting to reset an action
  ([4444426](https://github.com/will-stone/2n8/commit/444442619438ebd5277a489498e58bc3dc6d9068))
- Add type to $reset
  ([10a0f41](https://github.com/will-stone/2n8/commit/10a0f411ade17cebe844d370184d1df344a96ddf))

## [0.2.1](https://github.com/will-stone/2n8/compare/0.2.0...0.2.1) (2024-12-05)

### Patches

- Refactor for one less line of code
  ([1e59973](https://github.com/will-stone/2n8/commit/1e59973eadff144e3d69eba24b5c2cfadf13d253))
- Fix server and client hydration mismatch
  ([99dc112](https://github.com/will-stone/2n8/commit/99dc1127638b2a9f4f54b1e0b916321b91c01f84))
- Fix reset not announcing change to listeners
  ([19e8250](https://github.com/will-stone/2n8/commit/19e82506337436f67c2b8698bfd93e35b393b810))

## [0.2.0](https://github.com/will-stone/2n8/compare/0.1.0...0.2.0) (2024-12-03)

### Minor changes

- Removed React hook from main bundle, and exported it from /react
  ([284fb26](https://github.com/will-stone/2n8/commit/284fb26d100df82dbf7d0769f45e280816e03618))

## [0.1.0](https://github.com/will-stone/2n8/compare/0.0.5...0.1.0) (2024-12-02)

### Minor changes

- ClassyStore -> TwoAndEight, createClassyStore -> createStore
  ([1914c91](https://github.com/will-stone/2n8/commit/1914c91e36baba97a4b26f765d1388768c5e7aa6))

### Patches

- Add reset state ability
  ([ce28af7](https://github.com/will-stone/2n8/commit/ce28af7a61fd152497604012b9d42a6f529946a9))

## [0.0.5](https://github.com/will-stone/2n8/compare/0.0.4...0.0.5) (2024-12-02)

### Patches

- Fix build artefacts not in release
  ([caa40bd](https://github.com/will-stone/2n8/commit/caa40bd878495f1b5b6d033321c80f710208af31))

## [0.0.4](https://github.com/will-stone/2n8/compare/0.0.3...0.0.4) (2024-12-02)

### Patches

- Initial library release (for testing only)
  ([d0df404](https://github.com/will-stone/2n8/commit/d0df404a96605fa1f0aba841c697de1bc2cb6417))

## 0.0.3 (2024-12-02)

### Patches

- Try release again
  ([69e7cdd](https://github.com/will-stone/2n8/commit/69e7cdd88bb778bc14a0eb74d36ee4779d7b28f1))
- Setup auto-releases
  ([a25769c](https://github.com/will-stone/2n8/commit/a25769c7af59770228da0be64c57e6e8c9aecb9a))
