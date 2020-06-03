import Scanner from './scanner.js'

const whitespace = /[ \t\r\n\f]/
const startWithWhitespace = /^[ \t\r\n\f]+/
const combinator = /[>+~]/

const combinatorMap = {
  ' ': 'descendant',
  '>': 'child',
  '+': 'next-sibling',
  '~': 'subsequent-sibling',
  '||': 'column',
}

const attributeMap = {
  undefined: 'exists',
  '=': 'equals',
  '~=': 'includes',
  '|=': 'dash',
  '^=': 'prefix',
  '$=': 'suffix',
  '*=': 'substring',
}

function isWhitespace(char) {
  return whitespace.test(char)
}

function isCombinator(char) {
  return combinator.test(char)
}

function trimStart(string) {
  return string.replace(startWithWhitespace, '')
}

export default function parse(selector) {
  selector = trimStart(selector)

  const selectorList = []
  let tokens = []
  let foundWhitespace = false

  while (selector !== '') {
    const char = selector.charAt(0)

    if (char === ',') {
      const prevToken = tokens[tokens.length - 1]
      if (prevToken == undefined || prevToken.type === 'combinator') {
        throw new Error('')
      } else {
        selectorList.push(tokens)
        tokens = []
        foundWhitespace = false
        selector = trimStart(selector.substring(1))
      }
    } else if (isWhitespace(char)) {
      foundWhitespace = true
      selector = trimStart(selector)
    } else if (isCombinator(char)) {
      const prevToken = tokens[tokens.length - 1]
      if (prevToken == undefined || prevToken.type === 'combinator') {
        throw new Error('')
      } else {
        tokens.push({ type: 'combinator', name: combinatorMap[char] })
        foundWhitespace = false
        selector = trimStart(selector.substring(1))
      }
    } else if (char === '|') {
      const nextChar = selector.charAt(1)
      if (nextChar !== '|') {
        throw new Error('')
      } else {
        tokens.push({ type: 'combinator', name: combinatorMap['||'] })
        foundWhitespace = false
        selector = trimStart(selector.substring(2))
      }
    } else {
      if (foundWhitespace) {
        const prevToken = tokens[tokens.length - 1]
        if (prevToken == undefined || prevToken.type === 'combinator') {
          throw new Error('')
        } else {
          tokens.push({ type: 'combinator', name: combinatorMap[' '] })
        }
      }
      foundWhitespace = false

      if (char === '*') {
        tokens.push({ type: 'universal' })
        selector = selector.substring(1)
      } else if (char === '[') {
        const result = selector.match(Scanner['attr'])
        if (result == null) {
          throw new Error('')
        } else {
          tokens.push({
            type: 'attribute',
            name: result[1],
            value: result[3] || '',
            mode: attributeMap[result[2]],
          })
          selector = selector.substring(result[0].length)
        }
      } else if (char === '.' || char === '#') {
        const result = selector.match(Scanner['ident'])
        if (result == null) {
          throw new Error('')
        } else {
          tokens.push({
            type: 'attribute',
            name: char === '.' ? 'class' : 'id',
            value: result[0],
            mode: char === '.' ? 'includes' : 'equals',
          })
          selector = selector.substring(result[0].length + 1)
        }
      } else if (char === ':') {
        const nextChar = selector.charAt(1)
        if (nextChar === ':') {
          // TODO
          // pseudo-element
        } else {
          // TODO
          // pseudo-class
        }
      } else {
        const result = selector.match(Scanner['type'])
        if (result == null) {
          throw new Error('')
        } else {
          tokens.push({ type: 'type', name: result[0] })
          selector = selector.substring(result[0].length)
        }
      }
    }
  }

  const prevToken = tokens[tokens.length - 1]
  if (prevToken == undefined || prevToken.type === 'combinator') {
    throw new Error('')
  } else {
    selectorList.push(tokens)
  }

  return selectorList
}
