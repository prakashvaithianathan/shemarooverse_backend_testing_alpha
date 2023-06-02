/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = 'AC0e4857497167e25641f584d7111a9e13'
const authToken = '2a35973f8672e43f2fad70cbd14144d8'
const client = require('twilio')(accountSid, authToken)
const { buildErrObject } = require('../../middleware/utils')

/**
 * Checks User model if user with an specific email exists
 * @param {string} number - user email
 * @param {string} content - user content
 */
const sendSMS = async (number = '', content = '') => {
  try {
    return new Promise(async (resolve, reject) => {
      client.messages
        .create({
          body: content,
          from: '+16206477796',
          to: number
        })
        .then((message) => {
          if (message) {
            resolve(message)
          } else {
            reject('Something went wrong')
          }
        })
    })
  } catch (error) {
    return buildErrObject(422, error.message)
  }
}

module.exports = { sendSMS }
