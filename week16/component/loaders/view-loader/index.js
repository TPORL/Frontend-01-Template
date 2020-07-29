const parser = require('./parser.js')

module.exports = function viewLoader(source) {
  const tree = parser(source)
  let template = null
  let script = null

  for (let node of tree.children) {
    if (node.tagName === 'template') {
      template = node.children.filter((e) => e.type !== 'text')[0]
    } else if (node.tagName === 'script') {
      script = node.children[0].content
    }
  }

  const visit = (node) => {
    if (node.type === 'text') return JSON.stringify(node.content)

    const attrs = {}
    for (const attribute of node.attributes) {
      attrs[attribute.name] = attribute.value
    }

    const children = node.children.map((node) => visit(node))

    return `createElement('${node.tagName}', ${JSON.stringify(attrs)}, ${children})` // prettier-ignore
  }

  return `
import createElement, { Text, Wrapper } from './createElement.js'

export default class Carousel {
  setAttribute(name, value) {
    this[name] = value
  }

  render() {
    return ${visit(template)}
  }

  mountTo(parent) {
    this.render().mountTo(parent)
  }
}
`
}
