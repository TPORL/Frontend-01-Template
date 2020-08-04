import { createElement, createRef } from '../../createElement.js'
import './tabs.css'

export default class Tabs {
  constructor() {
    this.children = []
    this.attributes = {}
    this.properties = {}
  }

  setAttribute(name, value) {
    this.attributes[name] = value
  }

  appendChild(child) {
    this.children.push(child)
  }

  select(index) {
    this.tabs.forEach((tab) => tab.classList.remove('is-active'))
    this.panes.forEach((tab) => tab.classList.remove('is-active'))
    this.tabs[index].classList.add('is-active')
    this.panes[index].classList.add('is-active')
  }

  render() {
    this.tabs = this.children.map((child, i) => (
      <div class="tabs-tab" onClick={() => this.select(i)}>
        {child.getAttribute('title') || ''}
      </div>
    ))

    this.panes = this.children.map((child) => (
      <div class="tabs-pane">{child}</div>
    ))

    return (
      <div class="tabs">
        <div class="tabs-nav">{this.tabs}</div>
        <div class="tabs-content">{this.panes}</div>
      </div>
    )
  }

  mountTo(element) {
    this.render().mountTo(element)
    this.select(0)
  }
}
