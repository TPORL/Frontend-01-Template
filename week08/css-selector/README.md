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
  - [x] `:not()`
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

  - [x] `:enable`
  - [x] `:disabled`
  - [ ] `:read-only`
  - [ ] `:read-write`
  - [ ] `:placeholder-shown`
  - [ ] `:default`
  - [x] `:checked`
  - [x] `:indeterminate`
  - [ ] `:blank`
  - [ ] `:valid`
  - [ ] `:invalid`
  - [ ] `:range`
  - [ ] `:out-of-range`
  - [ ] `:required`
  - [ ] `:optional`
  - [ ] `:user-invalid`

  Tree-Structural

  - [x] `:root`
  - [x] `:empty`
  - [x] `:nth-child()`
  - [x] `:nth-last-child()`
  - [x] `:first-child`
  - [x] `:last-child`
  - [x] `:only-child`
  - [x] `:nth-of-type()`
  - [x] `:nth-last-of-type()`
  - [x] `:first-of-type`
  - [x] `:last-of-type`
  - [x] `:only-of-type`

  Grid-Structural

  - [ ] `:nth-col()`
  - [ ] `:nth-last-col()`

### Combinators

- [x] `\u0020`
- [x] `>`
- [x] `+`
- [x] `~`
- [ ] `||`

### Selector List

- [x] `,`

## Demo

`npm run serve` and `F12`
