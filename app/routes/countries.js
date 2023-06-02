const express = require('express')
const router = express.Router()

require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const { getCountries, getCities } = require('../controllers/countries')

router.get(
  '/get_countries',
  // requireAuth,
  // roleAuthorization(['admin']),
  trimRequest.all,
  getCountries
)

router.get(
  '/get_cities',
  // requireAuth,
  // roleAuthorization(['admin']),
  trimRequest.all,
  getCities
)

module.exports = router
