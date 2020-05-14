# 每周总结可以写在这里

## JavaScript 部分

### Source Code

- Global code
- Eval code
- Function code
- Module code

### Lexical Environment

每种 Source Code 里都会生成 Lexical Environment，除此之外，BlockStatement 和 TryStatement 里面的 Catch 结构也会生成 Lexical Environment

Lexical Environment 由 Environment Record 和 outer。outer 连接外层的 Lexical Environment (形成 ES3 时代的作用域链)

global environment 就是 outer 为 null 的 Lexical Environment。通常 global environment 的 Environment Record 会记录 global object 和 一些全局变量

module environment 就是 Module code 的 Lexical Environment。通常会包含一些`import`导入的变量

function enviroment 就是 Function code 的 Lexical Environment。通常会包含`this`和`super`

### Environment Record

简单理解：用来存储当前 Lexical Environment 里面的值(包括变量, this, new.target, super)

### Realm

```
realm = {
  [[Intrinsics]]: intrinsic object
  [[GlobalObject]]: global object
  [[GlobalEnv]]: global environment
  [[TemplateMap]]: []
  [[HostDefined]]: any
}
```

简单理解：一个 realm 包含所有全局的东西，包括宿主环境提供内容

一个 JS Context 只有一个 realm

### Execution Context

每份 Source Code 都会创建一个 Execution Context

Execution Context 的组件

- code evaluation state
- Function
- Realm
- ScriptOrModule
- LexicalEnvironment
- VariableEnvironment
- Generator (Generator 函数的 Execution Context 才有)

LexicalEnvironment 和 VariableEnvironment 只是 Execution Context 的组件，这两其实都是 Lexical Environment。而 VariableEnvironment 只有在 Execution Context 里有 VariableStatements(也就是 var 旧时代) 才会创建

### 示例分析

> 个人理解，仅供参考

```js
const a = 1

function foo() {
  const b = 2
  console.log(a) // 1

  {
    const c = 3
    console.log(a, b, c) // 1 2 3
  }

  {
    const d = 4
    console.log(c) // error
  }
}
```

```js
/**
 * 代码执行前，创建好 Realm 和各种 Lexical Environment
 */
executionContextStack = []

realm = {
  // 包含一些全局对象
}

globalEnvironment = {
  environmentRecord: {
    // global object 等等
  },
  outer: null,
}

fooFunctionEnvironment = {
  environmentRecord: {
    foo,
  },
  outer: globalEnvironment,
}

fooBlock1Environment = {
  environmentRecord: {},
  outer: fooFunctionEnvironment,
}

fooBlock2Environment = {
  environmentRecord: {},
  outer: fooFunctionEnvironment,
}

/**
 * 代码开始执行
 */
globalExecutionContext = {
  // ...
  LexicalEnvironment: globalEnvironment,
}

globalEnvironment.environmentRecord.a = 1

executionContextStack.push(globalExecutionContext)

/**
 * 执行foo
 */
fooExecutionContext = {
  // ...
  LexicalEnvironment: fooFunctionEnvironment,
}

fooFunctionEnvironment.environmentRecord.b = 2
fooFunctionEnvironment.outer = globalEnvironment

executionContextStack.push(fooExecutionContext)

/**
 * 执行 foo 里面的 block1
 */
fooBlock1Environment.environmentRecord.c = 3
fooBlock2Environment.outer = fooFunctionEnvironment

/**
 * 执行 foo 里面的 block2
 */
fooBlock2Environment.environmentRecord.d = 4
fooBlock2Environment.outer = fooFunctionEnvironment

// fooBlock1Environment -> fooFunctionEnvironment -> globalEnvironment
// fooBlock2Environment -> fooFunctionEnvironment -> globalEnvironment
// 因为 Lexical Environment 一个个连接起来，所以 block1 结构里面，能顺着这条链访问到变量 a, b, c
// 但是 fooBlock2Environment 和 fooBlock1Environment 并没有连接关系，所以 fooBlock1Environment 不能访问到变量 c，因此会报错
```

TODO:

- 更严谨(这上面忽略了很多东西)
- 更复杂的案例

## 浏览器部分

- 学习了浏览器打开一个网站会向服务器发些什么内容以及服务器会向浏览器返回些什么内容
- 学习了怎么去读取并且处理这些内容

Request

```
GET / HTTP/1.1
X-Foo2: customized
Content-Type: application/x-www-form-urlencoded
Content-Length: 10

name=TPORL
```

Response

```
HTTP/1.1 200 OK
Content-Type: text/plain
X-Foo: bar
Date: Wed, 13 May 2020 04:22:59 GMT
Connection: keep-alive
Transfer-Encoding: chunked

2
ok
0
```
