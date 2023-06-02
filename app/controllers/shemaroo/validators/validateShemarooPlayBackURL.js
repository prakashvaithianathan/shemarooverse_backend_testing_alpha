const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates change password request
 */
const validateShemarooPlayBackURL = [
  check('catalog_id').not().isEmpty().withMessage('Catalog ID missing'),
  check('content_id').not().isEmpty().withMessage('Content ID missing'),
  check('friendly_id').not().isEmpty().withMessage('Friendly ID missing'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateShemarooPlayBackURL }
