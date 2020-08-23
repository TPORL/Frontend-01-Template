const http = require('http')
const archiver = require('archiver')

const options = {
  host: 'localhost',
  port: 3000,
  path: '/?filename=package.zip',
  method: 'POST',
  headers: {
    'Content-Type': 'application/octet-stream',
  },
}

const req = http.request(options, (res) => {})

const archive = archiver('zip', {
  zlib: { level: 9 },
})

archive.directory('./package', false)
archive.finalize()
archive.pipe(req)
archive.on('end', () => {
  req.end()
})
