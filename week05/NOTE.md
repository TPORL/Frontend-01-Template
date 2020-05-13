# 每周总结可以写在这里

## JavaScript 部分

### Lexical Environment

简单理解：包含一个 Environment Record 和一个 outer 属性。outer 属性连接外层的 Lexical Environment (形成 ES3 时代的作用域链)

### Environment Record

简单理解：包含当前 Lexical Environment 里面的值(包括 this, new.target, super)

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

每份 Source Code 都会创建一个 Execution Context，而目前(ECMAScript 2019)只有四种类型的 Source Code

- Global code
- Eval code
- Function code
- Module code

组件

- code evaluation state
- Function
- Realm
- ScriptOrModule
- LexicalEnvironment
- VariableEnvironment
- Generator (Generator 函数的 Execution Context 才有)

因为包含 Realm，所以在哪都能访问到全局变量

LexicalEnvironment 和 VariableEnvironment 只是 Execution Context 的组件，这两其实都是 Lexical Environment。而 VariableEnvironment 只有在 Execution Context 里有 VariableStatements(也就是 var 旧时代) 才会创建

### 示例分析

```js
// TODO
```

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
