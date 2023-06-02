const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const {
  register,
  verify,
  forgotPassword,
  resetPassword,
  getRefreshToken,
  login,
  roleAuthorization,
  loginGoogle,
  loginGoogleCallback,
  loginFacebook,
  loginFacebookCallback,
  loginMobile,
  verifyMobileLogin
} = require('../controllers/auth')

const {
  validateRegister,
  validateVerify,
  validateForgotPassword,
  validateResetPassword,
  validateLogin,
  mobileVerify,
  isValidMobile
} = require('../controllers/auth/validators')

/*
 * Auth routes
 */

/*
 * Register route
 */
router.post('/register', trimRequest.all, validateRegister, register)

/*
 * Verify route
 */
router.post('/verify', trimRequest.all, validateVerify, verify)

/*
 * Forgot password route
 */
router.post('/forgot', trimRequest.all, validateForgotPassword, forgotPassword)

/*
 * Reset password route
 */
router.post('/reset', trimRequest.all, validateResetPassword, resetPassword)

/*
 * Get new refresh token
 */
router.get(
  '/token',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getRefreshToken
)

/*
 * Login route
 */
router.post('/login', trimRequest.all, login)

router.get('/auth/google', trimRequest.all, loginGoogle)

router.get('/auth/google/callback', trimRequest.all, loginGoogleCallback)

router.get('/auth/facebook', trimRequest.all, loginFacebook)

router.get('/auth/facebook/callback', trimRequest.all, loginFacebookCallback)

router.post(
  '/auth/mobile',
  trimRequest.all,
  mobileVerify,
  isValidMobile,
  loginMobile
)

router.post('/auth/mobile/auth_handler_otp', trimRequest.all, verifyMobileLogin)

module.exports = router
