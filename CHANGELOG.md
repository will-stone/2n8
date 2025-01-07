# Changelog

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
