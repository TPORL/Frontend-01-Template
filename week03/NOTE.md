# 每周总结可以写在这里

## Expression

顺着优先级的关系过了一遍各种表达式，也介绍了类型转换，拆箱装箱，比较简单

## 语句与声明

### 简单语句

- ExpressionStatement
- EmptyStatement
- DebuggerStatement
- ThrowStatement
- ContinueStatement
- BreakStatement
- ReturnStatement

### 复合语句

- BlockStatement
- IfStatement
- SwitchStatement
- IterationStatement
- WithStatement
- LabelledStatement
- TryStatement

### 声明

- HoistableDeclaration

  - FunctionDeclaration
  - GeneratorDeclaration
  - AsyncFunctionDeclaration
  - AsyncGeneratorDeclaration

- ClassDeclaration
- LexicalDeclaration

- VariableStatement

## Object

### 面相对象

- 基于类(Class)
- 基于原型(Prototype)

### 描述符

- data descriptors

  - value
  - writable
  - configurable
  - enumerable

- accessor descriptors

  - set
  - get
  - configurable
  - enumerable

### API / Grammar

- {} . [] `Object.defineProperty`
- `Object.create` / `Object.setPrototypeOf` / `Object.getPrototypeOf`
- new / class / extends
- new / function / prototype

## 作业

1. [convertStringToNumber](./convertStringToNumber.js)
2. [convertNumberToString](./convertNumberToString.js)
3. [JavaScript 标准里的特殊对象](./JavaScript标准里的特殊对象.md)
