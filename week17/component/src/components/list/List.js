import { createElement, createRef } from '../../createElement.js'
import './list.css'

export default class List {
  constructor() {
    this.children = []
    this.attributes = {}
    this.properties = {}
  }

  setAttribute(name, value) {
    this[name] = value
  }

  appendChild(child) {
    this.children.push(child)
  }

  render() {
    return <div class="list">{this.dataSource.map(this.renderItem)}</div>
  }

  mountTo(element) {
    this.render().mountTo(element)
  }
}
