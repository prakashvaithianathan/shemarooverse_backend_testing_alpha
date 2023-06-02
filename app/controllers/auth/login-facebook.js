/* eslint-disable max-statements */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
const { matchedData } = require('express-validator')

const {
  findUser,
  userIsBlocked,
  checkLoginAttemptsAndBlockExpires,
  passwordsDoNotMatch,
  saveLoginAttemptsToDB,
  saveUserAccessAndReturnToken
} = require('./helpers')

const { handleError } = require('../../middleware/utils')
const { checkPassword } = require('../../middleware/auth')

const User = require('../../models/user')

const {
  registerUser,
  setUserInfo,
  returnRegisterToken,
  registerUserSSO
} = require('./helpers')

const {
  emailExists,
  sendRegistrationEmailMessage
} = require('../../middleware/emailer')

const { usernameExists } = require('../../middleware/username')

const https = require('https')

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const APP_ID = process.env.APP_ID
const APP_SECRET = process.env.APP_SECRET
const REDIRECT_URI_FACEBOOK = `${process.env.BACKEND_URL}/auth/facebook/callback`

const loginFacebook = async (req, res) => {
  try {
    const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI_FACEBOOK
    )}&scope=email,public_profile`

    // Step 2: Redirect the user to the auth URL
    res.redirect(authUrl)
  } catch (error) {
    handleError(res, error)
  }
}

const loginFacebookCallback = async (req, res) => {
  try {
    const code = req.query.code

    const tokenUrl = `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI_FACEBOOK
    )}&client_secret=${APP_SECRET}&code=${code}`

    https.get(tokenUrl, (response) => {
      let body = ''

      response.on('data', (chunk) => {
        body += chunk
      })

      response.on('end', () => {
        const { access_token } = JSON.parse(body)

        const userDataUrl = `https://graph.facebook.com/v12.0/me?fields=name,email,picture&access_token=${access_token}`

        https.get(userDataUrl, async (responses) => {
          let body = ''

          responses.on('data', (chunk) => {
            body += chunk
          })

          responses.on('end', async () => {
            const data = JSON.parse(body)

            if (data?.email) {
              const user = await User.findOne({ email: data?.email })

              if (user) {
                user.loginAttempts = 0
                await saveLoginAttemptsToDB(user)
                const response = await saveUserAccessAndReturnToken(req, user)
                response.user.username = data.name
                response.user.profile_picture = data.picture.data.url
                res.status(200).json({
                  success: true,
                  result: response,
                  message: null
                })
              } else {
                const locale = req.getLocale()
                req = matchedData(data)

                const doesEmailExists = await emailExists(data.email)

                if (!doesEmailExists) {
                  data.provider = 'Facebook'
                  data.loginType = 2
                  const item = await registerUserSSO(data)

                  const userInfo = await setUserInfo(item)
                  console.log('====================================')
                  console.log(userInfo)
                  console.log('====================================')
                  const response = await returnRegisterToken(item, userInfo)
                  sendRegistrationEmailMessage(locale, item)
                  res.status(201).json({
                    success: true,
                    result: response,
                    message: null
                  })
                } else {
                }
              }
            } else {
              res.status(400).json({
                success: true,
                result: null,
                message: 'SOMETHING_WENT_WRONG'
              })
            }
          })
        })
      })
    })

    // console.log(req.body)
    // const data = matchedData(req)
    // const user = await findUser(data.emailOrUsername)
    // await userIsBlocked(user)
    // await checkLoginAttemptsAndBlockExpires(user)
    // const isPasswordMatch = await checkPassword(req.body.password, user)
    // if (!isPasswordMatch) {
    //   res.status(200).json({
    //     success: false,
    //     result: null,
    //     message: 'WRONG_PASSWORD'
    //   })
    //   // handleError(res, await passwordsDoNotMatch(user))
    // } else {
    //   // all ok, register access and return token
    //   user.loginAttempts = 0
    //   await saveLoginAttemptsToDB(user)
    //   const response = await saveUserAccessAndReturnToken(req, user)
    //   res.status(200).json({
    //     success: true,
    //     result: response,
    //     message: null
    //   })
    // }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { loginFacebook, loginFacebookCallback }

// facebook login code - previous
// const loginFacebookCallback = async (req, res) => {
//   try {
//     const code = req.query.code

//     const tokenUrl = `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(
//       REDIRECT_URI_FACEBOOK
//     )}&client_secret=${APP_SECRET}&code=${code}`

//     https.get(tokenUrl, (response) => {
//       let body = ''

//       response.on('data', (chunk) => {
//         body += chunk
//       })

//       response.on('end', () => {
//         const { access_token } = JSON.parse(body)

//         const profilePictureUrl = `https://graph.facebook.com/v12.0/me/picture?redirect=false&type=large&access_token=${access_token}`

//         https.get(profilePictureUrl, (response) => {
//           let body = ''

//           response.on('data', (chunk) => {
//             body += chunk
//           })

//           response.on('end', () => {
//             const { data } = JSON.parse(body)
//             const profilePictureUrl = data.url

//             // Use the profile picture URL in your app
//             // ...
//             console.log('====================================')
//             console.log(profilePictureUrl)
//             console.log('====================================')
//           })
//         })

//         // Step 2: Get user name and email
//         const userDataUrl = `https://graph.facebook.com/v12.0/me?fields=name,email&access_token=${access_token}`

//         https.get(userDataUrl, (response) => {
//           let body = ''

//           response.on('data', (chunk) => {
//             body += chunk
//           })

//           response.on('end', () => {
//             const { name, email } = JSON.parse(body)
//             console.log('====================================')
//             console.log(name, email)
//             console.log('====================================')
//             // Use the user's name and email in your app
//             // ...
//           })
//         })
//       })
//     })
