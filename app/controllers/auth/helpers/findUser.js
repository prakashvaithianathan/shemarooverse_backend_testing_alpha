/* eslint-disable max-statements */
const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds user by email
 * @param {string} email - user´s email
 *  @param {string} username - user´s email
 */
const findUser = async (emailOrUsername = '') => {
  return new Promise(async (resolve, reject) => {
    if (emailOrUsername) {
      const atIndex = emailOrUsername.indexOf('@')

      if (atIndex !== -1) {
        const item = await User.findOne({ email: emailOrUsername })
        // console.log(item)

        if (!item) {
          try {
            const err = { message: 'USER_DOES_NOT_EXIST' }
            await itemNotFound(err, 'WRONG_EMAIL', 'USER_DOES_NOT_EXIST')
            reject(item)
          } catch (error) {
            reject(error)
          }
        } else {
          try {
            resolve(item)
          } catch (error) {
            reject(error)
          }
        }

        // User.findOne(
        //   {
        //     email: emailOrUsername
        //   },
        //   'password loginAttempts blockExpires name email role verified verification',
        //   async (err, item) => {
        //     if (!item) {
        //       try {
        //         await itemNotFound(err, 'WRONG_EMAIL', 'USER_DOES_NOT_EXIST')
        //         reject(item)
        //       } catch (error) {
        //         reject(error)
        //       }
        //     } else {
        //       try {
        //         await itemNotFound(err, item, 'USER_DOES_NOT_EXIST')
        //         resolve(item)
        //       } catch (error) {
        //         reject(error)
        //       }
        //     }
        //   }
        // )
      } else {
        const item = await User.findOne({ username: emailOrUsername })

        if (!item) {
          try {
            const err = { message: 'USER_DOES_NOT_EXIST' }
            await itemNotFound(err, 'WRONG_USERNAME', 'USER_DOES_NOT_EXIST')
            reject(item)
          } catch (error) {
            reject(error)
          }
        } else {
          try {
            resolve(item)
          } catch (error) {
            reject(error)
          }
        }
      }
    }
  })
}

module.exports = { findUser }
