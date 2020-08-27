const express = require('express')
const router = express.Router()
const axios = require('axios')
const unzipper = require('unzipper')
const path = require('path')

router.post('/', async (req, res, next) => {
  const token = req.headers.token

  try {
    const user = (
      await axios({
        url: 'https://api.github.com/user',
        method: 'GET',
        headers: {
          Authorization: `token ${token}`,
        },
      })
    ).data

    // TODO
    // 权限验证

    const writeStream = unzipper.Extract({
      path: path.resolve(__dirname, '../../server/public'),
    })
    req.pipe(writeStream)
    req.on('end', () => {
      res.json({ ok: true })
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
