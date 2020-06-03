# CSS Selector

## Standards

- [Selectors Level 3](https://www.w3.org/TR/selectors-3/)
- [Selectors Level 4](https://www.w3.org/TR/selectors-4/)

## Supported

### Simple Selectors

- Type selectors

  - [x] `<tag-name>`
  - [x] `<namespace>|<tag-name>`

- Universal selectors

  - [x] `*`

- Attribute selectors

  - [x] `[attr]`
  - [x] `[attr=val]`
  - [x] `[attr~=val]`
  - [x] `[attr|=val]`
  - [x] `[attr^=val]`
  - [x] `[attr$=val]`
  - [x] `[attr*=val]`

- Class selectors

  - [x] `.cls`

- ID selectors

  - [x] `#id`

- Pseudo-classes

  Logical

  - [ ] `:is()`
  - [ ] `:not()`
  - [ ] `:where()`
  - [ ] `:has()`

  Linguistic

  - [ ] `:dir()`
  - [ ] `:lang()`

  Location

  - [ ] `:any-link`
  - [ ] `:link, visited`
  - [ ] `:local-link`
  - [ ] `:target`
  - [ ] `:target-within`
  - [ ] `:scope`

  User Action

  - [ ] `:hover`
  - [ ] `:active`
  - [ ] `:focus`
  - [ ] `:focus-visible`
  - [ ] `:focus-within`

  Time-dimensional

  - [ ] `:current`
  - [ ] `:past`
  - [ ] `:future`

  Resource

  - [ ] `:playing`
  - [ ] `:paused`

  Input

  - [ ] `:enable`
  - [ ] `:disabled`
  - [ ] `:read-only`
  - [ ] `:read-write`
  - [ ] `:placeholder-shown`
  - [ ] `:default`
  - [ ] `:checked`
  - [ ] `:indeterminate`
  - [ ] `:blank`
  - [ ] `:valid`
  - [ ] `:invalid`
  - [ ] `:range`
  - [ ] `:out-of-range`
  - [ ] `:required`
  - [ ] `:optional`
  - [ ] `:user-invalid`

  Tree-Structural

  - [ ] `:root`
  - [ ] `:empty`
  - [ ] `:nth-child()`
  - [ ] `:nth-last-child()`
  - [ ] `:first-child`
  - [ ] `:last-child`
  - [ ] `:only-child`
  - [ ] `:nth-of-type()`
  - [ ] `:nth-last-of-type()`
  - [ ] `:first-of-type`
  - [ ] `:last-of-type`
  - [ ] `:only-of-type`

  Grid-Structural

  - [ ] `:nth-col()`
  - [ ] `:nth-last-col()`

### Combinators

- [x] `\u0020`
- [x] `>`
- [x] `+`
- [x] `~`
- [x] `||`

### Selector List

- [x] `,`

## Demo

`npm run serve` and `F12`
