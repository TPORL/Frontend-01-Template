const express = require('express')
const router = express.Router()
const axios = require('axios')

const { clientID, clientSecret, redirectUri } = require('../config')

router.get('/', async (req, res, next) => {
  const code = req.query.code
  if (!code) {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}`
    )
    return
  }

  try {
    const { data } = await axios({
      url: 'https://github.com/login/oauth/access_token',
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      data: {
        client_id: clientID,
        client_secret: clientSecret,
        code,
      },
    })
    res.render('index', { token: data.access_token })
  } catch (err) {
    next(err)
  }
})

module.exports = router
