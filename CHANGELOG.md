# Changelog

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
