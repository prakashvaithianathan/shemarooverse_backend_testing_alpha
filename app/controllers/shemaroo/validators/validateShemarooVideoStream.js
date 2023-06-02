const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates change password request
 */
const validateShemarooVideoStream = [
  check('smart_url').not().isEmpty().withMessage('Smart URL missing'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateShemarooVideoStream }
