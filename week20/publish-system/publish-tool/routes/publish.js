const express = require('express')
const router = express.Router()
const axios = require('axios')
const archiver = require('archiver')

router.get('/', async (req, res, next) => {
  const token = req.query.token

  try {
    const archive = archiver('zip', {
      zlib: { level: 9 },
    })
    archive.directory('./package', false)
    archive.finalize()

    const { data } = await axios({
      url: 'http://localhost:3000/publish',
      method: 'POST',
      headers: {
        token: token,
        'Content-Type': 'application/octet-stream',
      },
      data: archive,
    })

    res.json(data)
  } catch (err) {
    next(err)
  }
})

module.exports = router
