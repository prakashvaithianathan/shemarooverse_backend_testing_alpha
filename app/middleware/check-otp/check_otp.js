/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */

const User = require('../../models/user')
const { buildErrObject } = require('../../middleware/utils')
const { handleError } = require('../../middleware/utils')

const checkOTP = async (phone = '', otp = '') => {
  try {
    return new Promise(async (resolve, reject) => {
      const getUser = await User.findOne({ phone }).lean()

      if (getUser) {
        if (getUser.verification === otp) {
          const verifyUser = await User.findOneAndUpdate(
            { phone },
            { verified: true },
            { new: true }
          )
          if (verifyUser.verified) {
            resolve(verifyUser)
          } else {
            reject({
              code: 422,
              message: 'Something went wrong!'
            })
          }
        } else {
          reject({
            code: 422,
            message: "OTP didn't match"
          })
        }
      } else {
        reject({
          code: 422,
          message: 'No Mobile number found!'
        })
      }
    })
  } catch (error) {
    return buildErrObject(422, error.message)
  }
}

module.exports = { checkOTP }
