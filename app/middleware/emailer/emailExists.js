const User = require('../../models/user')
const { buildErrObject } = require('../../middleware/utils')

/**
 * Checks User model if user with an specific email exists
 * @param {string} email - user email
 */
const emailExists = async (email = '') => {
  try {
    return new Promise(async (resolve, reject) => {
      const data = await User.findOne({ email })

      if (data) {
        return reject(buildErrObject(422, 'EMAIL_ALREADY_EXISTS'))
      } else {
        resolve(false)
      }
    })
  } catch (error) {
    return buildErrObject(422, error.message)
  }
}

module.exports = { emailExists }
