const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates verify request
 */
const mobileVerify = [
  check('phone')
    .exists()
    .withMessage('MISSING PHONE NUMBER')
    .not()
    .isEmpty()
    .withMessage('MISSING PHONE NUMBER')
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,4}$/)
    .withMessage('Please enter a valid phone number'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { mobileVerify }
