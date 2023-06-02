const uuid = require('uuid')
const User = require('../../../models/user')
const { buildErrObject } = require('../../../middleware/utils')

/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const registerUserSSO = async (req = {}) => {
  try {
    return new Promise(async (resolve, reject) => {
      try {
        const user = {
          username: req.name ? req.name : 'null@email.com',
          email: req.email ? req.email : 'null@email.com',
          provider: req.provider,
          phone: req.phone,
          loginType: req.loginType,
          password: 'null',
          verification: req.verification ? req.verification : uuid.v4()
        }

        const createUser = await User.create(user)
        if (createUser) {
          resolve(createUser)
        } else {
          reject(buildErrObject(422, 'USER_NOT_CREATED'))
        }
      } catch (error) {
        return reject(buildErrObject(422, error.message))
      }
    })
  } catch (error) {
    return buildErrObject(422, error.message)
  }
}

module.exports = { registerUserSSO }
