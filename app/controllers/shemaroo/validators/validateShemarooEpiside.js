const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates change password request
 */
const validateShemarooEpisode = [
  check('friendly_id').not().isEmpty().withMessage('Friendly Id missing'),
  check('episode_id').not().isEmpty().withMessage('Episide Id missing'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateShemarooEpisode }
