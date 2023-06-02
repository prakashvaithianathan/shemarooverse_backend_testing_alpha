/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
/* eslint-disable max-statements */
const { matchedData } = require('express-validator')

const {
  findUser,
  userIsBlocked,
  checkLoginAttemptsAndBlockExpires,
  passwordsDoNotMatch,
  saveLoginAttemptsToDB,
  saveUserAccessAndReturnToken
} = require('./helpers')

const { handleError } = require('../../middleware/utils')
const { checkPassword } = require('../../middleware/auth')
const { sendSMS } = require('../../middleware/sms-handler')
const otpGenerator = require('otp-generator')
const User = require('../../models/user')
const { checkOTP } = require('../../middleware/check-otp')

const {
  registerUserSSO,
  setUserInfo,
  returnRegisterToken
} = require('./helpers')

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const loginMobile = async (req, res) => {
  try {
    const OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      numbers: true
    })

    const content = `Hi, your OTP for logging into your Shemarooverse account is ${OTP}. Please use this code within 10 minutes to complete your login`

    const isUserExist = await User.findOne({ phone: req.body.phone })

    if (isUserExist) {
      const isSendSMS = await sendSMS(req.body.phone, content)
      const setOTP = await User.findOneAndUpdate(
        { _id: isUserExist._id },
        { verification: OTP },
        { new: true }
      )
      if (isSendSMS && setOTP) {
        res.status(200).json({
          success: true,
          result: null,
          message: 'OTP successfully sent to your number'
        })
      } else {
        res.status(400).json({
          success: true,
          result: null,
          message: 'Something went wrong!'
        })
      }
    } else {
      const isSendSMS = await sendSMS(req.body.phone, content)
      if (isSendSMS) {
        req.body.loginType = 3
        req.body.provider = 'Mobile'
        req.body.verification = OTP
        const item = await registerUserSSO(req.body)
        const userInfo = await setUserInfo(item)
        const response = await returnRegisterToken(item, userInfo)
        res.status(200).json({
          success: true,
          result: null,
          message: 'OTP successfully sent to your number'
        })
      }
    }
  } catch (error) {
    handleError(res, error)
  }
}

const verifyMobileLogin = async (req, res) => {
  try {
    const user = await checkOTP(req.body.phone, req.body.otp)

    const response = await saveUserAccessAndReturnToken(req, user)

    if (response) {
      res.status(200).json({
        success: true,
        result: response,
        message: 'User Successfully Logged-In!'
      })
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { loginMobile, verifyMobileLogin }
