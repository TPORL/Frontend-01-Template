function* ChunkedBodyParser() {
  const WAITING_LENGTH = Symbol('WAITING_LENGTH')
  const WAITING_LENGTH_LINE_END = Symbol('WAITING_LENGTH_LINE_END')
  const READING_CHUNK = Symbol('READING_CHUNK')
  const WAITING_NEW_LINE = Symbol('WAITING_NEW_LINE')
  const WAITING_NEW_LINE_END = Symbol('WAITING_NEW_LINE_END')

  let currentState = WAITING_LENGTH
  let length = 0
  let content = []

  let isFinished = false
  while (!isFinished) {
    const char = yield

    switch (currentState) {
      case WAITING_LENGTH:
        if (char === '\r') {
          if (length === 0) {
            isFinished = true
          } else {
            currentState = WAITING_LENGTH_LINE_END
          }
        } else {
          length *= 16
          length += parseInt(char, 16)
        }
        break
      case WAITING_LENGTH_LINE_END:
        if (char === '\n') {
          currentState = READING_CHUNK
        }
        break
      case READING_CHUNK:
        content.push(char)
        length--
        if (length === 0) {
          currentState = WAITING_NEW_LINE
        }
        break
      case WAITING_NEW_LINE:
        if (char === '\r') {
          currentState = WAITING_NEW_LINE_END
        }
        break
      case WAITING_NEW_LINE_END:
        if (char === '\n') {
          currentState = WAITING_LENGTH
        }
        break
    }
  }

  return content.join('')
}

module.exports = function* ResponseParser() {
  const WAITING_STATUS_LINE = Symbol('WAITING_STATUS_LINE')
  const WAITING_STATUS_LINE_END = Symbol('WAITING_STATUS_LINE_END')
  const WAITING_HEADER_NAME = Symbol('WAITING_HEADER_NAME')
  const WAITING_HEADER_SPACE = Symbol('WAITING_HEADER_SPACE')
  const WAITING_HEADER_VALUE = Symbol('WAITING_HEADER_VALUE')
  const WAITING_HEADER_LINE_END = Symbol('WAITING_HEADER_LINE_END')
  const WAITING_HEADERS_END = Symbol('WAITING_HEADERS_END')
  const WAITING_BODY = Symbol('WAITING_BODY')

  let currentState = WAITING_STATUS_LINE
  let statusLine = ''
  let headerName = ''
  let headerValue = ''
  let headers = {}
  let bodyParser = null
  let body = ''

  let isFinished = false
  while (!isFinished) {
    const text = yield

    outside: for (const char of text) {
      switch (currentState) {
        case WAITING_STATUS_LINE:
          if (char === '\r') {
            currentState = WAITING_STATUS_LINE_END
          } else {
            statusLine += char
          }
          break
        case WAITING_STATUS_LINE_END:
          if (char === '\n') {
            currentState = WAITING_HEADER_NAME
          }
          break
        case WAITING_HEADER_NAME:
          if (char === ':') {
            currentState = WAITING_HEADER_SPACE
          } else if (char === '\r') {
            currentState = WAITING_HEADERS_END
          } else {
            headerName += char
          }
          break
        case WAITING_HEADER_SPACE:
          if (char === ' ') {
            currentState = WAITING_HEADER_VALUE
          }
          break
        case WAITING_HEADER_VALUE:
          if (char === '\r') {
            currentState = WAITING_HEADER_LINE_END
            headers[headerName] = headerValue
            headerName = headerValue = ''
          } else {
            headerValue += char
          }
          break
        case WAITING_HEADER_LINE_END:
          if (char === '\n') {
            currentState = WAITING_HEADER_NAME
          }
          break
        case WAITING_HEADERS_END:
          if (char === '\n') {
            currentState = WAITING_BODY

            const transferEncoding = headers['Transfer-Encoding']
            if (transferEncoding === 'chunked') {
              bodyParser = ChunkedBodyParser()
            } else {
              // TODO
              // Other Body Parser
            }
            bodyParser.next()
          }
          break
        case WAITING_BODY:
          const result = bodyParser.next(char)
          if (result.done) {
            body = result.value
            isFinished = true
            break outside
          }
          break
      }
    }
  }

  const matchArray = statusLine.match(/HTTP\/1\.1 ([0-9]+) ([\s\S]+)/)
  return {
    statusCode: matchArray[1],
    statusText: matchArray[2],
    headers,
    body,
  }
}
