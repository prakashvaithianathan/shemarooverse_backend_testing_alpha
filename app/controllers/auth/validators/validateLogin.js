const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates register request
 */
/**
 * Validates login request
 */

const validateLogin = [
  check('emailOrUsername')
    .trim() // Remove leading and trailing spaces
    .not()
    .isEmpty()
    .withMessage('Email or username is required') // Check if email or username is empty
    .custom((value, { req }) => {
      // Check if value is a valid email or a valid username
      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(value) &&
        !/^[A-Za-z0-9_-]+$/.test(value)
      ) {
        throw new Error('Email or username is invalid')
      }
      return true
    })
  // check('email')
  //   .exists()
  //   .withMessage('MISSING')
  //   .not()
  //   .isEmpty()
  //   .withMessage('IS_EMPTY')
  //   .isEmail()
  //   .withMessage('EMAIL_IS_NOT_VALID'),
  // check('password')
  //   .exists()
  //   .withMessage('MISSING')
  //   .not()
  //   .isEmpty()
  //   .withMessage('IS_EMPTY')
  //   .isLength({
  //     min: 5
  //   })
  //   .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  // (req, res, next) => {
  //   validateResult(req, res, next)
  // }
]

module.exports = { validateLogin }
