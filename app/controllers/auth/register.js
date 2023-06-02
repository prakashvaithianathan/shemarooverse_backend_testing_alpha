/* eslint-disable max-statements */
const { matchedData } = require('express-validator')

const { registerUser, setUserInfo, returnRegisterToken } = require('./helpers')

const { handleError } = require('../../middleware/utils')
const {
  emailExists,
  sendRegistrationEmailMessage
} = require('../../middleware/emailer')

const { usernameExists } = require('../../middleware/username')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const register = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    req = matchedData(req)

    const doesEmailExists = await emailExists(req.email)
    const doesUsernameExists = await usernameExists(req.username)
    if (!doesEmailExists && !doesUsernameExists) {
      req.loginType = 0
      req.provider = 'Email'
      const item = await registerUser(req)
      const userInfo = await setUserInfo(item)
      console.log(userInfo)
      const response = await returnRegisterToken(item, userInfo)
      sendRegistrationEmailMessage(locale, item)
      res.status(201).json({
        success: true,
        result: response,
        message: null
      })
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { register }
