const UserAccess = require('../../../models/userAccess')
const { setUserInfo } = require('./setUserInfo')
const { generateToken } = require('./generateToken')
const {
  getIP,
  getBrowserInfo,
  getCountry,
  buildErrObject
} = require('../../../middleware/utils')

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
const saveUserAccessAndReturnToken = async (req = {}, user = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userAccessData = {
        email: user.email,
        ip: getIP(req),
        browser: getBrowserInfo(req),
        country: getCountry(req)
      }

      const createUserAccess = await UserAccess.create(userAccessData)

      if (createUserAccess) {
        const userInfo = await setUserInfo(user)
        // Returns data with access token

        resolve({
          token: generateToken(user._id),
          user: userInfo
        })
      } else {
        reject(buildErrObject(422, 'NO_DATA_FOUND'))
      }
    } catch (error) {
      return reject(buildErrObject(422, error.message))
    }
  })
}

module.exports = { saveUserAccessAndReturnToken }
