const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')
const { phone } = require('phone')

/**
 * Validates verify request
 */
const isValidMobile = async (req, res, next) => {
  const isValidPhone = phone(req.body.phone)

  if (!isValidPhone.isValid) {
    res.status(400).json({
      success: false,
      data: null,
      message: 'Enter the valid mobile number'
    })
  } else {
    return next()
  }
}

module.exports = { isValidMobile }
