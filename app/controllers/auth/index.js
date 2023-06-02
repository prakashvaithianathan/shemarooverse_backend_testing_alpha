const { forgotPassword } = require('./forgotPassword')
const { getRefreshToken } = require('./getRefreshToken')
const { login } = require('./login')
const { register } = require('./register')
const { resetPassword } = require('./resetPassword')
const { roleAuthorization } = require('./roleAuthorization')
const { verify } = require('./verify')
const { loginGoogle, loginGoogleCallback } = require('./login-google')
const { loginFacebook, loginFacebookCallback } = require('./login-facebook')
const { loginMobile, verifyMobileLogin } = require('./login-mobile')

module.exports = {
  forgotPassword,
  getRefreshToken,
  login,
  register,
  resetPassword,
  roleAuthorization,
  verify,
  loginGoogle,
  loginGoogleCallback,
  loginFacebook,
  loginFacebookCallback,
  loginMobile,
  verifyMobileLogin
}
