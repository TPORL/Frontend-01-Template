const css = require('css')

const EOF = Symbol('EOF') // End Of File

let stack = []
let currentToken = null
let currentAttribute = null
let currentTextNode = null

let rules = []

function addCSSRules(cssCode) {
  const ast = css.parse(cssCode)
  rules.push(...ast.stylesheet.rules)
}

function matchSelector(element, selector) {
  if (!selector || !element.attributes) return false

  if (selector[0] === '#') {
    const attr = element.attributes.find((attr) => attr.name === 'id')
    return attr && attr.value === selector.slice(1)
  } else if (selector[1] === '.') {
    const attr = element.attributes.find((attr) => attr.name === 'class')
    return attr && attr.value === selector.slice(1)
  } else {
    return element.tagName === selector
  }
}

function computeSpecificity(selectorParts) {
  /**
   * 0: ID selectors
   * 1: class selectors, attributes selectors, pseudo-classes
   * 2: type selectors, pseudo-elements
   * 3: universal selector
   */
  const sp = [0, 0, 0, 0]
  for (const part of selectorParts) {
    if (part[0] === '#') {
      sp[0] += 1
    } else if (part[1] === '.') {
      sp[1] += 1
    } else if (part[2] === '*') {
      sp[3] += 1
    } else {
      sp[2] += 1
    }
  }
  return sp
}

function compareSpecificity(sp1, sp2) {
  for (let i = 0; i < 4; i++) {
    const delta = sp1[i] - sp2[i]
    if (delta) return delta
  }
  return 0
}

function computeCSS(element) {
  const elements = stack.slice().reverse()

  if (!element.computedStyle) {
    element.computedStyle = {}
  }

  for (const rule of rules) {
    for (const selector of rule.selectors) {
      const selectorParts = selector.split(' ').reverse()

      if (!matchSelector(element, selectorParts[0])) {
        continue
      }

      let j = 1
      for (let i = 0; i < elements.length; i++) {
        if (matchSelector(elements[i], selectorParts[j])) {
          j++
        }
      }

      // matched
      if (j >= selectorParts.length) {
        const computedStyle = element.computedStyle
        const specificity = computeSpecificity(selectorParts)
        for (const { property, value } of rule.declarations) {
          if (!computedStyle[property]) {
            computedStyle[property] = {}
          }
          if (
            !computedStyle[property].specificity ||
            compareSpecificity(
              computedStyle[property].specificity,
              specificity
            ) < 0
          ) {
            computedStyle[property].specificity = specificity
            computedStyle[property].value = value
          }
        }
      }
    }
  }
}

function emit(token) {
  let top = stack[stack.length - 1]

  if (token.type === 'START_TAG') {
    const element = {
      type: 'element',
      tagName: token.tagName,
      children: [],
      attributes: [],
    }

    for (const p in token) {
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p],
        })
      }
    }

    computeCSS(element)

    top.children.push(element)

    if (!token.isSelfClosing) {
      stack.push(element)
    }

    currentTextNode = null
  } else if (token.type === 'END_TAG') {
    if (top.tagName !== token.tagName) {
      throw new Error("tag start end doesn't match!")
    } else {
      if (top.tagName === 'style') {
        addCSSRules(top.children[0].content)
      }
      stack.pop()
    }
    currentTextNode = null
  } else if (token.type === 'CHARACTER') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'CHARACTER',
        content: '',
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

function dataState(char) {
  if (char === '<') {
    return tagOpenState
  } else if (char === EOF) {
    emit({
      type: 'EOF',
    })
    return
  } else {
    emit({
      type: 'CHARACTER',
      content: char,
    })
    return dataState
  }
}

function tagOpenState(char) {
  if (char === '/') {
    return endTagOpenState
  } else if (/[a-zA-Z]/.test(char)) {
    currentToken = {
      type: 'START_TAG',
      tagName: '',
    }
    return tagNameState(char)
  } else if (char === EOF) {
    emit({
      type: 'EOF',
    })
  } else {
    emit({
      type: 'CHARACTER',
      content: char,
    })
    return dataState
  }
}

function tagNameState(char) {
  if (/[\t\n\f ]/.test(char)) {
    return beforeAttributeNameState
  } else if (char === '/') {
    return selfClosingStartTagState
  } else if (char === '>') {
    emit(currentToken)
    return dataState
  } else if (/[a-zA-Z]/.test(char)) {
    currentToken.tagName += char.toLowerCase()
    return tagNameState
  } else if (char === EOF) {
    emit({
      type: 'EOF',
    })
    return
  } else {
    currentToken.tagName += char
    return tagNameState
  }
}

function beforeAttributeNameState(char) {
  if (/[\t\n\f ]/.test(char)) {
    return beforeAttributeNameState
  } else if (char === '/' || char === '>' || char === EOF) {
    return afterAttributeNameState(char)
  } else if (char === '=') {
  } else {
    currentAttribute = {
      name: '',
      value: '',
    }
    return attributeNameState(char)
  }
}

function attributeNameState(char) {
  if (/[\t\n\f />]/.test(char) || char === EOF) {
    return afterAttributeNameState(char)
  } else if (char === '=') {
    return beforeAttributeValueState
  } else if (char === '"' || char === "'" || char === '<') {
  } else {
    currentAttribute.name += char
    return attributeNameState
  }
}

function beforeAttributeValueState(char) {
  if (/[\t\n\f ]/.test(char)) {
    return beforeAttributeValueState
  } else if (char === '"') {
    return doubleQuotedAttributeValueState
  } else if (char === "'") {
    return singleQuotedAttributeValueState
  } else if (char === '>') {
    return dataState
  } else {
    return unquotedAttributeValueState(char)
  }
}

function doubleQuotedAttributeValueState(char) {
  if (char === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValueState
  } else if (char === EOF) {
    emit({
      type: 'EOF',
    })
  } else {
    currentAttribute.value += char
    return doubleQuotedAttributeValueState
  }
}

function singleQuotedAttributeValueState(char) {
  if (char === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValueState
  } else if (char === EOF) {
    emit({
      type: 'EOF',
    })
  } else {
    currentAttribute.value += char
    return singleQuotedAttributeValueState
  }
}

function afterQuotedAttributeValueState(char) {
  if (/[\t\n\f ]/.test(char)) {
    return beforeAttributeNameState
  } else if (char === '/') {
    return selfClosingStartTagState
  } else if (char === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return dataState
  } else if (EOF) {
    emit({
      type: 'EOF',
    })
  } else {
    currentAttribute.value += char
    return doubleQuotedAttributeValueState
  }
}

function unquotedAttributeValueState(char) {
  if (/[\t\n\f ]/.test(char)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeNameState
  } else if (char === '/') {
  } else if (char === '>') {
  } else if (
    char === '"' ||
    char === "'" ||
    char === '<' ||
    char === '=' ||
    char === '`'
  ) {
  } else if (char === EOF) {
    emit({
      type: 'EOF',
    })
  } else {
    currentAttribute.value += char
    return unquotedAttributeValueState
  }
}

function selfClosingStartTagState(char) {
  if (char === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return dataState
  } else if (char === EOF) {
    emit({
      type: 'EOF',
    })
  }
}

function endTagOpenState(char) {
  if (/[a-zA-Z]/.test(char)) {
    currentToken = {
      type: 'END_TAG',
      tagName: '',
    }
    return tagNameState(char)
  }
}

function afterAttributeNameState(char) {
  if (/[\t\n\f ]/.test(char)) {
    return attributeNameState
  } else if (char === '/') {
    return selfClosingStartTagState
  } else if (char === '=') {
    return beforeAttributeValueState
  } else if (char === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return dataState
  } else if (char === EOF) {
    emit({
      type: EOF,
    })
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value
    currentAttribute = {
      name: '',
      value: '',
    }
    return attributeNameState(char)
  }
}

module.exports = function parseHTML(html) {
  stack = [{ type: 'document', children: [] }]
  currentToken = null
  currentAttribute = null
  currentTextNode = null

  let state = dataState
  for (const char of html) {
    state = state(char)
  }
  state = state(EOF)
  return stack[0]
}
