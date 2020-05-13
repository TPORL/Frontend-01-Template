const net = require('net')

class Request {
  constructor(options) {
    this.method = options.method || 'GET'
    this.host = options.host || '127.0.0.1'
    this.port = options.port || '8080'
    this.path = options.path || '/'
    this.headers = options.headers || {}
    this.body = options.body || {}
    this.bodyText = ''

    const contentType = this.headers['Content-Type']
    if (contentType === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    } else if (contentType === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.entries(this.body)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
    } else if (contentType === 'multipart/form-data') {
      // TODO
    }

    if (this.bodyText.length) {
      this.headers['Content-Length'] = this.bodyText.length
    }
  }

  toString() {
    return `
${this.method} ${this.path} HTTP/1.1\r
${Object.entries(this.headers)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\r\n')}\r
\r
${this.bodyText}`.trimLeft()
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser()

      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.connect({
          host: this.host,
          port: this.port,
        })

        connection.on('connect', () => {
          connection.write(this.toString())
        })
      }

      connection.on('data', (data) => {
        parser.receive(data.toString())
        if (parser.isDone) {
          resolve(parser.response)
        }
        connection.end()
      })

      connection.on('error', (error) => {
        reject(error)
        connection.end()
      })
    })
  }
}

class ChunkedBodyParser {
  WAITING_LENGTH = Symbol('WAITING_LENGTH')
  WAITING_LENGTH_LINE_END = Symbol('WAITING_LENGTH_LINE_END')
  READING_CHUNK = Symbol('READING_CHUNK')
  WAITING_NEW_LINE = Symbol('WAITING_NEW_LINE')
  WAITING_NEW_LINE_END = Symbol('WAITING_NEW_LINE_END')

  currentState = this.WAITING_LENGTH
  length = 0
  content = []
  isDone = false

  receiveChar(char) {
    if (this.isDone) return
    switch (this.currentState) {
      case this.WAITING_LENGTH:
        if (char === '\r') {
          if (this.length === 0) {
            this.isDone = true
          } else {
            this.currentState = this.WAITING_LENGTH_LINE_END
          }
        } else {
          this.length *= 10
          this.length += char.codePointAt(0) - 48
        }
        break
      case this.WAITING_LENGTH_LINE_END:
        if (char === '\n') {
          this.currentState = this.READING_CHUNK
        }
        break
      case this.READING_CHUNK:
        this.content.push(char)
        this.length--
        if (this.length === 0) {
          this.currentState = this.WAITING_NEW_LINE
        }
        break
      case this.WAITING_NEW_LINE:
        if (char === '\r') {
          this.currentState = this.WAITING_NEW_LINE_END
        }
        break
      case this.WAITING_NEW_LINE_END:
        if (char === '\n') {
          this.currentState = this.WAITING_LENGTH
        }
        break
    }
  }
}

class ResponseParser {
  WAITING_STATUS_LINE = Symbol('WAITING_STATUS_LINE')
  WAITING_STATUS_LINE_END = Symbol('WAITING_STATUS_LINE_END')
  WAITING_HEADER_NAME = Symbol('WAITING_HEADER_NAME')
  WAITING_HEADER_SPACE = Symbol('WAITING_HEADER_SPACE')
  WAITING_HEADER_VALUE = Symbol('WAITING_HEADER_VALUE')
  WAITING_HEADER_LINE_END = Symbol('WAITING_HEADER_LINE_END')
  WAITING_HEADERS_END = Symbol('WAITING_HEADERS_END')
  WAITING_BODY = Symbol('WAITING_BODY')

  currentState = this.WAITING_STATUS_LINE
  statusLine = ''
  headerName = ''
  headerValue = ''
  headers = {}
  bodyParser = null
  body = ''

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }

  receiveChar(char) {
    switch (this.currentState) {
      case this.WAITING_STATUS_LINE:
        if (char === '\r') {
          this.currentState = this.WAITING_STATUS_LINE_END
        } else {
          this.statusLine += char
        }
        break
      case this.WAITING_STATUS_LINE_END:
        if (char === '\n') {
          this.currentState = this.WAITING_HEADER_NAME
        }
        break
      case this.WAITING_HEADER_NAME:
        if (char === ':') {
          this.currentState = this.WAITING_HEADER_SPACE
        } else if (char === '\r') {
          this.currentState = this.WAITING_HEADERS_END
        } else {
          this.headerName += char
        }
        break
      case this.WAITING_HEADER_SPACE:
        if (char === ' ') {
          this.currentState = this.WAITING_HEADER_VALUE
        }
        break
      case this.WAITING_HEADER_VALUE:
        if (char === '\r') {
          this.currentState = this.WAITING_HEADER_LINE_END
          this.headers[this.headerName] = this.headerValue
          this.headerName = this.headerValue = ''
        } else {
          this.headerValue += char
        }
        break
      case this.WAITING_HEADER_LINE_END:
        if (char === '\n') {
          this.currentState = this.WAITING_HEADER_NAME
        }
        break
      case this.WAITING_HEADERS_END:
        if (char === '\n') {
          this.currentState = this.WAITING_BODY

          const transferEncoding = this.headers['Transfer-Encoding']
          if (transferEncoding === 'chunked') {
            this.bodyParser = new ChunkedBodyParser()
          } else {
            // TODO
            // Other Body Parser
          }
        }
        break
      case this.WAITING_BODY:
        this.bodyParser.receiveChar(char)
        break
    }
  }

  get isDone() {
    return this.bodyParser && this.bodyParser.isDone
  }

  get response() {
    const matchArray = this.statusLine.match(/HTTP\/1\.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: matchArray[1],
      statusText: matchArray[2],
      headers: this.headers,
      body: this.bodyParser.content.join(''),
    }
  }
}

class Response {}

void (async function () {
  const request = new Request({
    method: 'GET',
    host: '127.0.0.1',
    port: '8080',
    path: '/',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Foo2': 'customized',
    },
    body: {
      name: 'TPORL',
    },
  })

  const result = await request.send()
  console.log(result)
})()
