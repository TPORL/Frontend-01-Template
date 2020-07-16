export class Wrapper {
  constructor(type) {
    this.$root = document.createElement(type)
    this.children = []
  }

  setAttribute(name, value) {
    this.$root.setAttribute(name, value)
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

export default function createElement(Cls, attributes, ...children) {
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
        child = new Text(child)
      } else {
        element.appendChild(child)
      }
    }
  })(children)

  return element
}
