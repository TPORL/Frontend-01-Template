import Gesture from './gesture.js'

export class Wrapper {
  constructor(type) {
    this.$root = document.createElement(type)
    this.children = []
  }

  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      const eventName = RegExp.$1.replace(/^[\s\S]/, (c) => c.toLowerCase())
      this.$root.addEventListener(eventName, value)
    } else if (name === 'enableGesture' && value) {
      Gesture(this.$root)
    } else if (name === 'ref') {
      value.current = this.$root
    } else {
      this.$root.setAttribute(name, value)
    }
  }

  appendChild(child) {
    this.children.push(child)
  }

  addEventListener() {
    this.$root.addEventListener(...arguments)
  }

  get style() {
    return this.$root.style
  }

  mountTo(element) {
    element.appendChild(this.$root)
    this.children.forEach((child) => {
      child.mountTo(this.$root)
    })
  }
}

export class Text {
  constructor(text) {
    this.$root = document.createTextNode(text)
  }

  mountTo(element) {
    element.appendChild(this.$root)
  }
}

export function createElement(Cls, attributes, ...children) {
  let element

  if (typeof Cls === 'function') {
    element = new Cls()
  } else {
    element = new Wrapper(Cls)
  }

  for (const name in attributes) {
    element.setAttribute(name, attributes[name])
  }

  void (function visit(children) {
    for (const child of children) {
      if (child instanceof Array) {
        visit(child)
      } else if (typeof child === 'string') {
        element.appendChild(new Text(child))
      } else {
        element.appendChild(child)
      }
    }
  })(children)

  return element
}

export function createRef() {
  return { current: null }
}
