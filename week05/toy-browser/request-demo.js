const net = require('net')

const client = net.connect({
  host: '127.0.0.1',
  port: 8080,
})

client.on('connect', () => {
  console.log('connected to server!')
  client.write(
    `
GET / HTTP/1.1\r
Content-Type: application/x-www-form-urlencoded\r
Content-Length: 10\r
\r
name=TPORL
`.trim()
  )
})

client.on('data', (data) => {
  console.log(data.toString())
  client.end()
})

client.on('end', () => {
  console.log('disconnected from server')
})
