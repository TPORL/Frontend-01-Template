import parse from './parse.js'

function getIndex({ element, isReverse = false, isType = false }) {
  if (element.parentElement === null) return 0

  const children = element.parentElement.children
  const tagName = element.tagName
  let typeCount = 0

  for (let i = 0, length = children.length - 1; i <= length; i++) {
    const child = children[isReverse ? length - i : i]

    if (child === element) {
      return (isType ? typeCount : i) + 1
    }

    if (isType && child.tagName === tagName) {
      typeCount += 1
    }
  }
}

function matchNth(index, { a, n, s = '+', b = 0 }) {
  a = parseInt(a || 1)
  b = parseInt(s + b)

  if (index < b) return false
  if (n) {
    return (index - b) % a === 0
  } else {
    return index === a
  }
}

function matchElement(element, token) {
  const type = token.type

  if (type === 'type') {
    const tagName = token.name.split('|').pop() // ignore namespace
    return tagName.toLowerCase() === element.tagName.toLowerCase()
  } else if (type === 'attribute') {
    const attrValue = element.getAttribute(token.name)
    const tokenValue = token.value

    if (attrValue === null) return false

    switch (token.mode) {
      case 'exists':
        return true
      case 'equals':
        return attrValue === tokenValue
      case 'includes':
        return attrValue
          .split(' ')
          .filter((item) => item !== '')
          .some((item) => item === tokenValue)
      case 'dash':
        return attrValue
          .split(' ')
          .filter((item) => item !== '')
          .some((item) => item.split('-')[0] === tokenValue)
      case 'prefix':
        return attrValue.indexOf(tokenValue) === 0
      case 'suffix':
        for (let i = tokenValue.length - 1; i >= 0; i--) {
          if (tokenValue.charAt(i) !== attrValue.charAt(i)) return false
        }
        return true
      case 'substring':
        return attrValue.indexOf(tokenValue) !== -1
    }
  } else if (type === 'pseudo-class') {
    switch (token.name) {
      case 'not':
        return token.selectorList.some((selector) => {
          return !matchTokens(element, selector)
        })
      case 'enabled':
        return element.disabled === false
      case 'disabled':
        return element.disabled === true
      case 'checked':
        return element.checked === true
      case 'indeterminate':
        return element.indeterminate === true
      case 'root':
        return element === document.documentElement
      case 'empty':
        return element.childNodes.length === 0
      case 'nth-child': {
        const index = getIndex({ element })
        return matchNth(index, token.expression)
      }
      case 'nth-last-child': {
        const index = getIndex({ element, isReverse: true })
        return matchNth(index, token.expression)
      }
      case 'first-child':
        return element.previousElementSibling === null
      case 'last-child':
        return element.nextElementSibling === null
      case 'only-child':
        return (
          element.previousElementSibling === null &&
          element.nextElementSibling === null
        )
      case 'nth-of-type': {
        const index = getIndex({ element, isType: true })
        return matchNth(index, token.expression)
      }
      case 'nth-last-of-type': {
        const index = getIndex({ element, isType: true, isReverse: true })
        return matchNth(index, token.expression)
      }
      case 'first-of-type':
        return getIndex({ element, isType: true }) === 0
      case 'last-of-type':
        return getIndex({ element, isType: true, isReverse: true }) === 0
      case 'only-of-type':
        return (
          getIndex({ element, isType: true }) ===
          getIndex({ element, isType: true, isReverse: true })
        )
    }
  } else {
    return false
  }
}

function matchTokens(element, tokens) {
  const compoundTokens = []
  let relation = ''

  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i]
    if (token.type === 'combinator') {
      relation = token.name
      tokens = tokens.slice(0, i)
      break
    } else {
      compoundTokens.push(token)
    }
  }

  for (const token of compoundTokens) {
    if (!matchElement(element, token)) return false
  }

  let nextElement
  switch (relation) {
    case 'descendant':
      nextElement = element.parentElement
      while (nextElement) {
        if (matchTokens(nextElement, tokens)) return true
        nextElement = nextElement.parentElement
      }
      return false
    case 'child':
      if (!element.parentElement) return false
      return matchTokens(element.parentElement, tokens)
    case 'next-sibling':
      if (!element.previousElementSibling) return false
      return matchTokens(element.previousElementSibling, tokens)
    case 'subsequent-sibling':
      nextElement = element.previousElementSibling
      while (nextElement) {
        if (matchTokens(nextElement, tokens)) return true
        nextElement = nextElement.previousElementSibling
      }
      return false
    case 'column':
      // TODO
      break
  }

  return true
}

export default function match(element, selector) {
  const selectorList = parse(selector)

  return selectorList.map((tokens) => {
    return matchTokens(element, tokens)
  })
}
