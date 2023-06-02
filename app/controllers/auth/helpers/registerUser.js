const uuid = require('uuid')
const User = require('../../../models/user')
const { buildErrObject } = require('../../../middleware/utils')

/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const registerUser = async (req = {}) => {
  try {
    return new Promise(async (resolve, reject) => {
      const user = {
        username: req.username,
        email: req.email,
        phone: req.phone,
        provider: req.provider,
        loginType: req.loginType,
        password: req.password,
        verification: uuid.v4()
      }

      const createUser = await User.create(user)
      if (createUser) {
        resolve(createUser)
      } else {
        reject(buildErrObject(422, 'USER_NOT_CREATED'))
      }
    })
  } catch (error) {
    return buildErrObject(422, error.message)
  }
  // return new Promise((resolve, reject) => {
  //   const user = new User({
  //     username: req.username,
  //     email: req.email,
  //     password: req.password,
  //     verification: uuid.v4()
  //   })
  //   user.save((err, item) => {
  //     if (err) {
  //       reject(buildErrObject(422, err.message))
  //     }
  //     resolve(item)
  //   })
  // })
}

module.exports = { registerUser }
