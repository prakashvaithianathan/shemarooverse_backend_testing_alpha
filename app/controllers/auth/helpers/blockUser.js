const { addHours } = require('date-fns')
const HOURS_TO_BLOCK = 2

const { buildErrObject } = require('../../../middleware/utils')
const User = require('../../../models/user')
/**
 * Blocks a user by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK
 * @param {Object} user - user object
 */
const blockUser = async (user = {}) => {
  try {
    return new Promise(async (resolve, reject) => {
      const blockExpires = addHours(new Date(), HOURS_TO_BLOCK)

      const blockedUser = await User.findByIdAndUpdate(
        { _id: user._id },
        { blockExpires },
        { new: true }
      )

      if (blockedUser) {
        return resolve(buildErrObject(409, 'BLOCKED_USER'))
      } else {
        reject('ERROR')
      }
    })
  } catch (error) {
    return buildErrObject(409, error.message)
  }
}

module.exports = { blockUser }
