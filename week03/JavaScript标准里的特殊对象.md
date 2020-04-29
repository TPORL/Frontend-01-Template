# JavaScript 标准里的特殊对象

## Bound Function

Internal Slot

- `[[BoundTargetFunction]]`
- `[[BoundThis]]`
- `[[BoundArguments]]`

Internal Method

- `[[Call]]( thisArgument, argumentsList )`
- `[[Construct]]( argumentsList, newTarget )`

## Array

Internal Method

- `[[DefineOwnProperty]]( P, Desc )`

## String

Internal Slot

- `[[StringData]]`

Internal Method

- `[[GetOwnProperty]] ( P )`
- `[[DefineOwnProperty]] ( P, Desc )`
- `[[OwnPropertyKeys]] ( )`

## Arguments

Internal Slot

- `[[ParameterMap]]`

Internal Method

- `[[GetOwnProperty]] ( P )`
- `[[DefineOwnProperty]] ( P, Desc )`
- `[[Get]] ( P, Receiver )`
- `[[Set]] ( P, V, Receiver )`
- `[[Delete]] ( P )`

## Integer-Indexed

Internal Slot

- `[[TypedArrayName]]`

Internal Method

- `[[GetOwnProperty]] ( P )`
- `[[HasProperty]] ( P )`
- `[[DefineOwnProperty]] ( P, Desc )`
- `[[Get]] ( P, Receiver )`
- `[[Set]] ( P, V, Receiver )`
- `[[OwnPropertyKeys]] ( )`

## Module Namespace

Internal Slot

- `[[Module]]`
- `[[Exports]]`
- `[[Prototype]]`

Internal Method

- `[[SetPrototypeOf]] ( V )`
- `[[IsExtensible]] ( )`
- `[[PreventExtensions]] ( )`
- `[[GetOwnProperty]] ( P )`
- `[[DefineOwnProperty]] ( P, Desc )`
- `[[HasProperty]] ( P )`
- `[[Get]] ( P, Receiver )`
- `[[Set]] ( P, V, Receiver )`
- `[[Delete]] ( P )`
- `[[OwnPropertyKeys]] ( )`

## Immutable Prototype

Internal Slot

- `[[Prototype]]`

Internal Method

- `[[SetPrototypeOf]] ( V )`
- `SetImmutablePrototype ( O, V )`

## Proxy

Internal Slot

- `[[ProxyHandler]]`
- `[[ProxyTarget]]`

Internal Method

- `[[GetPrototypeOf]] ( )`
- `[[SetPrototypeOf]] ( V )`
- `[[IsExtensible]] ( )`
- `[[PreventExtensions]] ( )`
- `[[GetOwnProperty]] ( P )`
- `[[DefineOwnProperty]] ( P, Desc )`
- `[[HasProperty]] ( P )`
- `[[Get]] ( P, Receiver )`
- `[[Set]] ( P, V, Receiver )`
- `[[Delete]] ( P )`
- `[[OwnPropertyKeys]] ( )`
- `[[Call]] ( thisArgument, argumentsList )`
- `[[Construct]] ( argumentsList, newTarget )`
