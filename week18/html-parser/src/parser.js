const EOF = Symbol('EOF') // End Of File

let stack, currentToken, currentAttribute, currentTextNode, rules

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

    top.children.push(element)

    if (!token.isSelfClosing) {
      stack.push(element)
    }

    currentTextNode = null
  } else if (token.type === 'END_TAG') {
    if (top.tagName !== token.tagName) {
      throw new Error("tag start end doesn't match!")
    } else {
      stack.pop()
    }
    currentTextNode = null
  } else if (token.type === 'CHARACTER') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
    emit({
      type: 'EOF',
    })
  } else {
    emit({
      type: 'CHARACTER',
      content: '<' + char,
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
    /* istanbul ignore next */
    emit({
      type: 'EOF',
    })
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
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeNameState(char)
  } else if (
    char === '"' ||
    char === "'" ||
    char === '<' ||
    char === '=' ||
    char === '`'
  ) {
  } else if (char === EOF) {
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    return afterAttributeNameState
  } else if (char === '/') {
    return selfClosingStartTagState
  } else if (char === '=') {
    return beforeAttributeValueState
  } else if (char === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return dataState
  } else if (char === EOF) {
    /* istanbul ignore next */
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

function scriptData(char) {
  if (char == '<') {
    return scriptDataLessThanSign
  } else if (char === EOF) {
    /* istanbul ignore next */
    emit({
      type: EOF,
    })
  } else {
    emit({
      type: 'CHARACTER',
      content: char,
    })
    return scriptData
  }
}

function scriptDataLessThanSign(char) {
  if (char == '/') {
    return scriptDataEndTagOpen
  } else if (char === EOF) {
    /* istanbul ignore next */
    emit({
      type: EOF,
    })
  } else {
    emit({
      type: 'CHARACTER',
      content: '<',
    })
    return scriptData(char)
  }
}

function scriptDataEndTagOpen(char) {
  if (char == 's') {
    return scriptDataEndTagNameS
  } else if (char === EOF) {
    /* istanbul ignore next */
    emit({
      type: EOF,
    })
  } else {
    emit({
      type: 'CHARACTER',
      content: '</',
    })
    return scriptData(char)
  }
}

function scriptDataEndTagNameS(char) {
  if (char == 'c') {
    return scriptDataEndTagNameC
  } else if (char === EOF) {
    /* istanbul ignore next */
    emit({
      type: EOF,
    })
  } else {
    emit({
      type: 'CHARACTER',
      content: '</s',
    })
    return scriptData(char)
  }
}

function scriptDataEndTagNameC(char) {
  if (char == 'r') {
    return scriptDataEndTagNameR
  } else if (char === EOF) {
    /* istanbul ignore next */
    emit({
      type: EOF,
    })
  } else {
    emit({
      type: 'CHARACTER',
      content: '</sc',
    })
    return scriptData(char)
  }
}

function scriptDataEndTagNameR(char) {
  if (char == 'i') {
    return scriptDataEndTagNameI
  } else if (char === EOF) {
    /* istanbul ignore next */
    emit({
      type: EOF,
    })
  } else {
    emit({
      type: 'CHARACTER',
      content: '</scr',
    })
    return scriptData(char)
  }
}

function scriptDataEndTagNameI(char) {
  if (char == 'p') {
    return scriptDataEndTagNameP
  } else if (char === EOF) {
    /* istanbul ignore next */
    emit({
      type: EOF,
    })
  } else {
    emit({
      type: 'CHARACTER',
      content: '</scri',
    })
    return scriptData(char)
  }
}

function scriptDataEndTagNameP(char) {
  if (char == 't') {
    return scriptDataEndTag
  } else if (char === EOF) {
    /* istanbul ignore next */
    emit({
      type: EOF,
    })
  } else {
    emit({
      type: 'CHARACTER',
      content: '</scrip',
    })
    return scriptData(char)
  }
}

function scriptDataEndTag(char) {
  if (char == ' ') return scriptDataEndTag
  if (char == '>') {
    emit({
      type: 'END_TAG',
      tagName: 'script',
    })
    return dataState
  } else if (char === EOF) {
    /* istanbul ignore next */
    emit({
      type: EOF,
    })
  } else {
    emit({
      type: 'CHARACTER',
      content: '</script',
    })
    return scriptData(char)
  }
}

export default function parser(html) {
  stack = [{ type: 'document', children: [] }]
  currentToken = null
  currentAttribute = null
  currentTextNode = null
  rules = []

  let state = dataState
  for (const char of html) {
    state = state(char)
    if (stack[stack.length - 1].tagName === 'script' && state == dataState) {
      state = scriptData
    }
  }
  state = state(EOF)
  return stack[0]
}
