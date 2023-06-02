const { blockIsExpired } = require('./blockIsExpired')
const { buildErrObject } = require('../../../middleware/utils')
const User = require('../../../models/user')

/**
 *
 * @param {Object} user - user object.
 */
const checkLoginAttemptsAndBlockExpires = async (user = {}) => {
  try {
    return new Promise(async (resolve, reject) => {
      // Let user try to login again after blockexpires, resets user loginAttempts
      if (blockIsExpired(user)) {
        user.loginAttempts = 0
        const resetUserLoginAttempts = await User.findByIdAndUpdate(
          { _id: user._id },
          { loginAttempts: 0 },
          { new: true }
        )
        if (resetUserLoginAttempts) {
          return resolve(true)
        } else {
          reject('LOGIN_ATTEMPTS_FAILED')
        }
      }
      // User is not blocked, check password (normal behaviour)
      resolve(true)
    })
  } catch (error) {
    return buildErrObject(422, error.message)
  }
}

module.exports = { checkLoginAttemptsAndBlockExpires }
