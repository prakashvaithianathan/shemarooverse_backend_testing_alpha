const { buildErrObject } = require('../../../middleware/utils')
const User = require('../../../models/user')
/**
 * Saves login attempts to dabatabse
 * @param {Object} user - user object
 */
const saveLoginAttemptsToDB = async (user = {}) => {
  try {
    return new Promise(async (resolve, reject) => {
      const data = await User.findByIdAndUpdate(
        { _id: user._id },
        { $inc: { loginAttempts: 1 } },
        { new: true }
      )

      if (data) {
        resolve(data)
      } else {
        reject(buildErrObject(422, 'NO_DATA_FOUND'))
      }
    })
  } catch (error) {
    return buildErrObject(422, error.message)
  }
}

module.exports = { saveLoginAttemptsToDB }
