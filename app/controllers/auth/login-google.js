/* eslint-disable linebreak-style */
/* eslint-disable max-statements */
/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
const { matchedData } = require('express-validator')

const {
  findUser,
  userIsBlocked,
  checkLoginAttemptsAndBlockExpires,
  passwordsDoNotMatch,
  saveLoginAttemptsToDB,
  saveUserAccessAndReturnToken
} = require('./helpers')

const { handleError } = require('../../middleware/utils')
const { checkPassword } = require('../../middleware/auth')
const { google } = require('googleapis')
const User = require('../../models/user')

const {
  registerUser,
  setUserInfo,
  returnRegisterToken,
  registerUserSSO
} = require('./helpers')

const {
  emailExists,
  sendRegistrationEmailMessage
} = require('../../middleware/emailer')

const { usernameExists } = require('../../middleware/username')

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = `${process.env.BACKEND_URL}/auth/google/callback`
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
]

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)

const loginGoogle = async (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })

    // res.redirect(url)
    res.json({url})

  } catch (error) {
    handleError(res, error)
  }
}

const loginGoogleCallback = async (req, res) => {
  try {
    const { code } = req.query
    if (!code) {
      const error = {
        code: 400,
        message: 'code not found'
      }
      return handleError(res, error)
    }
    const { tokens } = await oauth2Client.getToken(code)

    oauth2Client.setCredentials(tokens)


    const date = new Date(tokens.expiry_date) // Convert timestamp to milliseconds

    const dateString = date.toLocaleString() // Convert date to local string format


    const { data } = await google
      .oauth2('v2')
      .userinfo.get({ auth: oauth2Client })

    if (data?.email) {
      const user = await User.findOne({ email: data?.email })

      if (user) {
        user.loginAttempts = 0
        await saveLoginAttemptsToDB(user)
        const response = await saveUserAccessAndReturnToken(req, user)
        response.user.username = data.name
        response.user.profile_picture = data.picture
        res.status(200).json({
          success: true,
          result: response,
          message: null
        })
      } else {
        const locale = req.getLocale()
        req = matchedData(data)

        const doesEmailExists = await emailExists(data.email)

        if (!doesEmailExists) {
          data.provider = 'Google'
          data.loginType = 1
          const item = await registerUserSSO(data)

          const userInfo = await setUserInfo(item)
          const response = await returnRegisterToken(item, userInfo)
          sendRegistrationEmailMessage(locale, item)
          res.status(200).json({
            success: true,
            result: response,
            message: null
          })
        } else {
        }
      }
    } else {
      res.status(400).json({
        success: true,
        result: null,
        message: 'SOMETHING_WENT_WRONG'
      })
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { loginGoogle, loginGoogleCallback }
