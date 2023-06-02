const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const {
  getAllCategory,
  getAllMoviesFromCategory,
  getShemarooCatalog,
  getShemarooItems,
  getShemarooEpisodes,
  getVideoStream,
  getPlayBackURL
} = require('../controllers/shemaroo')

const {
  validateShemarooItems,
  validateShemarooEpisode,
  validateShemarooVideoStream,
  validateShemarooPlayBackURL
} = require('../controllers/shemaroo/validators')

// router.get(
//   '/:id',
//   requireAuth,
//   roleAuthorization(['admin']),
//   trimRequest.all,
//   validateGetCity,
//   getCity
// )

// router.get(
//     '/get/all-category',
//     trimRequest.all,
//     getAllCategory
//   )

//   router.post(
//     '/get/movies-by-category',
//     trimRequest.all,
//     getAllMoviesFromCategory
//   )

router.get('/get-catalogue', trimRequest.all, getShemarooCatalog)

router.post(
  '/get-shemaroo-items',
  trimRequest.all,
  validateShemarooItems,
  getShemarooItems
)

router.post(
  '/get-shemaroo-episodes',
  trimRequest.all,
  validateShemarooEpisode,
  getShemarooEpisodes
)

// router.post(
//   '/get-shemaroo-video-stream',
//   trimRequest.all,
//   validateShemarooVideoStream,
//   getVideoStream
// )

router.post(
  '/get-shemaroo-video-stream',
  trimRequest.all,
  validateShemarooPlayBackURL,
  getPlayBackURL
)





module.exports = router
