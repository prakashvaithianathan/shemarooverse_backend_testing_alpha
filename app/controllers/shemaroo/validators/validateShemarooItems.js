const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates change password request
 */
const validateShemarooItems = [
  check('friendly_id').not().isEmpty().withMessage('Friendly Id missing'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateShemarooItems }
