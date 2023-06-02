const User = require('../../models/user')
const { buildErrObject } = require('../../middleware/utils')

/**
 * Checks User model if user with an specific email exists
 * @param {string} email - user email
 */
const usernameExists = async (username = '') => {
  try {
    return new Promise(async (resolve, reject) => {
      const data = await User.findOne({ username })

      if (data) {
        return reject(buildErrObject(422, 'USERNAME_ALREADY_EXISTS'))
      } else {
        resolve(false)
      }
    })
  } catch (error) {
    return buildErrObject(422, error.message)
  }
}

module.exports = { usernameExists }
