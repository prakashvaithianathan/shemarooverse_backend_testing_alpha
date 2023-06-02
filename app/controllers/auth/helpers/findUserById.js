const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds user by ID
 * @param {string} id - user´s id
 */
const findUserById = (userId = '') => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId)

      if (user) {
        resolve(user)
      } else {
        const err = { message: 'No User Found' }
        await itemNotFound(err, user, 'USER_DOES_NOT_EXIST')
      }
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = { findUserById }
