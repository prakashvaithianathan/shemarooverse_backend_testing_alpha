const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates register request
 */
const validateRegister = [
  check('username')
    .exists()
    .withMessage('NAME MISSING')
    .not()
    .isEmpty()
    .withMessage('PLEASE_FILL_USERNAME')
    .isLength({ min: 5 })
    .withMessage('must be at least 5 chars long')
    // .matches(/^[A-Za-z ]+$/)
    // .withMessage('name invalid format')
    .custom((value) => !/\s/.test(value))
    .withMessage('Username must not contain spaces') // Check if username contains spaces
    .custom((value) => !/-/.test(value))
    .withMessage('Username must not contain hyphens'), // Check if username contains hyphens,

  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('PLEASE_FILL_EMAIL')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),

  check('password')
    .exists()
    .withMessage('PASSWORD MISSING')
    .not()
    .isEmpty()
    .withMessage('PLEASE_FILL_PASSWORD')
    .matches(/(^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$)+/)
    .withMessage(
      'Password must be a minimum 8 characters & Maximum 16 characters.At least one lowercase,At least one uppercase,At least one digit and At least it should have 8 characters long.Eg: Abcd1234'
    )
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateRegister }
