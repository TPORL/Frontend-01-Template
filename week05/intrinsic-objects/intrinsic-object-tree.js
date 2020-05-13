/**
 * 固有对象树
 *
 * 有的固有对象并没有 Global Name，忽略
 * 例如：%ArrayIteratorPrototype%
 */

function isObject(value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

// 顶层固有对象的 Global Name 集合
const globalNames = [
  // Function Properties
  'eval',
  'isFinite',
  'isNaN',
  'parseFloat',
  'parseInt',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',

  // Constructor Properties
  'Array',
  'ArrayBuffer',
  'BigInt',
  'BigInt64Array',
  'BigUint64Array',
  'Boolean',
  'DataView',
  'Date',
  'Error',
  'EvalError',
  'Float32Array',
  'Float64Array',
  'Function',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'Map',
  'Number',
  'Object',
  'Promise',
  'Proxy',
  'RangeError',
  'ReferenceError',
  'RegExp',
  'Set',
  'SharedArrayBuffer',
  'String',
  'Symbol',
  'SyntaxError',
  'TypeError',
  'Uint8Array',
  'Uint8ClampedArray',
  'Uint16Array',
  'Uint32Array',
  'URIError',
  'WeakMap',
  'WeakSet',

  // Other Properties
  'Atomics',
  'JSON',
  'Math',
  'Reflect',

  // Additional Properties of the Global Object
  'escape',
  'unescape',
]

const intrinsicObjectTree = {
  id: 'globalThis',
  children: [],
}

let set = new Set()

function go(target, { id, children }) {
  const keys = Reflect.ownKeys(target)
  keys.forEach((key) => {
    const globalName =
      id + (typeof key === 'symbol' ? `[${key.description}]` : `.${key}`)

    if (set.has(globalName)) return
    set.add(globalName)

    const descriptor = Reflect.getOwnPropertyDescriptor(target, key)

    let value
    if (descriptor.get) {
      try {
        value = descriptor.get.call(target)
      } catch (error) {}
    } else {
      value = descriptor.value
    }

    if (isObject(value)) {
      const node = {
        id: globalName,
        children: [],
      }

      children.push(node)

      if (key === 'constructor' || key === Symbol.species) return
      go(value, node)

      // Additional Properties of the Object.prototype Object
      // ECMAScript 2019 B.2.2.1
      if (globalName === 'Object.prototype') {
        node.children.push({ id: 'Object.prototype.__proto__', children: [] })
      }
    }
  })
}

globalNames.forEach((globalName) => {
  const node = {
    id: globalName,
    children: [],
  }

  go(globalThis[globalName], node)

  intrinsicObjectTree.children.push(node)
})

// Print
const intrinsicObjectList = []
void (function walk(children) {
  children.forEach(({ id, children }) => {
    intrinsicObjectList.push(id)
    walk(children)
  })
})(intrinsicObjectTree.children)
console.log(intrinsicObjectList)
