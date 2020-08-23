const http = require('http')
const fs = require('fs')
const unzipper = require('unzipper')

const server = http.createServer((req, res) => {
  const writeStream = unzipper.Extract({
    path: '../server/public',
  })

  req.pipe(writeStream)
  req.on('end', () => {
    res.writeHead('200', { 'Content-Type': 'text/plain' })
    res.end('ok')
  })
})

server.listen(3000, '0.0.0.0')
