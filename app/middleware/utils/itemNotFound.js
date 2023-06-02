const { buildErrObject } = require('./buildErrObject')

/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {string} message - message
 */
const itemNotFound = (err = {}, item = {}, message = 'NOT_FOUND') => {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(buildErrObject(422, err.message))
    }
    if (!item) {
      return reject(buildErrObject(400, message))
    }
    if (item === 'WRONG_EMAIL') {
      return reject(buildErrObject(200, message))
    }
    if (item === 'WRONG_USERNAME') {
      return reject(buildErrObject(200, message))
    }
    resolve()
  })
}

module.exports = { itemNotFound }
