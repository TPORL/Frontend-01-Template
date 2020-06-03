import parse from './parse.js'

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
    // TODO
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
      return matchTokens(element.parentElement, tokens)
    case 'next-sibling':
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
