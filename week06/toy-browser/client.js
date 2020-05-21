const net = require('net')
const ResponseParser = require('./ReponseParser')
const parseHTML = require('./parseHTML')

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
    } else if (contentType === 'text/xml') {
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
      const parser = ResponseParser()
      parser.next()

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
        const result = parser.next(data.toString())
        if (result.done) {
          resolve(result.value)
          connection.end()
        }
      })

      connection.on('error', (error) => {
        reject(error)
        connection.end()
      })
    })
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

  const response = await request.send()
  const dom = parseHTML(response.body)
  console.log(JSON.stringify(dom, null, '  '))
})()
