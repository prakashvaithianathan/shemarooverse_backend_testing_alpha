/* eslint-disable prettier/prettier */
const { handleError } = require('../../middleware/utils')
const { getItems, checkQueryString } = require('../../middleware/db')
const axios = require('axios')
const Vimeo = require('@vimeo/vimeo').Vimeo
const http = require('https')
const crypto = require('crypto')
var request = require('request')

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const getShemarooCatalog = async (req, res) => {
  try {
    const location = 'IN'
    const options = {
      hostname: process.env.SHEMAROO_BASEURL,
      path: `/catalog_lists/shemarooverse-catalogs?auth_token=${process.env.SHEMAROO_AUTH_TOKEN}&region=${location}`,
      method: 'GET'
    }

    const request = http.request(options, (response) => {
      let data = ''
      response.on('data', (chunk) => {
        data += chunk
      })

      response.on('end', () => {
        const parsedData = JSON.parse(data)
        res.status(200).json({
          success: true,
          result: parsedData,
          message: 'FETCHED_SUCCESSFULLY'
        })
      })
    })

    request.on('error', (error) => {
      res.status(400).json({
        success: false,
        result: error,
        message: 'URL_NOT_FOUND'
      })
    })

    request.end()
  } catch (error) {
    handleError(res, error)
  }
}

const getShemarooItems = async (req, res) => {
  try {
    const location = 'IN'
    const options = {
      hostname: process.env.SHEMAROO_BASEURL,
      path: `/catalogs/${req.body.friendly_id}/items?auth_token=${process.env.SHEMAROO_AUTH_TOKEN}&region=${location}`,
      method: 'GET'
    }

    const request = http.request(options, (response) => {
      let data = ''
      response.on('data', (chunk) => {
        data += chunk
      })

      response.on('end', () => {
        const parsedData = JSON.parse(data)
        res.status(200).json({
          success: true,
          result: parsedData,
          message: 'FETCHED_SUCCESSFULLY'
        })
      })
    })

    request.on('error', (error) => {
      res.status(400).json({
        success: false,
        result: error,
        message: 'CATALOGUE_NOT_FOUND'
      })
    })

    request.end()
  } catch (error) {
    handleError(res, error)
  }
}

const getShemarooEpisodes = async (req, res) => {
  try {
    const location = 'IN'
    const options = {
      hostname: process.env.SHEMAROO_BASEURL,
      path: `/catalogs/${req.body.friendly_id}/items/${req.body.episode_id}/episodes?auth_token=${process.env.SHEMAROO_AUTH_TOKEN}&region=${location}`,
      method: 'GET'
    }

    const request = http.request(options, (response) => {
      let data = ''
      response.on('data', (chunk) => {
        data += chunk
      })

      response.on('end', () => {
        const parsedData = JSON.parse(data)
        res.status(200).json({
          success: true,
          result: parsedData,
          message: 'FETCHED_SUCCESSFULLY'
        })
      })
    })

    request.on('error', (error) => {
      res.status(400).json({
        success: false,
        result: error,
        message: 'CATALOGUE_NOT_FOUND'
      })
    })

    request.end()
  } catch (error) {
    handleError(res, error)
  }
}

const getVideoStream = async (req, res) => {
  try {
    const smarturl_accesskey = process.env.SHEMAROO_SMARTURL_ACCESSKEY
    const smarturl_parameters = 'service_id=10&play_url=yes&protocol=hls&us='

    const md5Hash = crypto.createHash('md5')
    md5Hash.update(
      smarturl_accesskey + req.body.smart_url + '?' + smarturl_parameters,
      'utf8'
    )

    // Calculate the hex digest (output) from the hash object
    const md5HexDigest = md5Hash.digest('hex')

    const location = 'IN'

    const domain = req.body.smart_url.split('://')[1].split('/')[0]
    const path =
      '/' + req.body.smart_url.split('://')[1].split('/').slice(1).join('/')

    const options = {
      hostname: domain,
      path: `${path}?${smarturl_parameters}${md5HexDigest}`,
      method: 'GET'
    }

    const request = http.request(options, (response) => {
      let data = ''
      response.on('data', (chunk) => {
        data += chunk
      })

      response.on('end', () => {
        const parsedData = JSON.parse(data)
        res.status(200).json({
          success: true,
          result: parsedData,
          message: 'FETCHED_SUCCESSFULLY'
        })
      })
    })

    request.on('error', (error) => {
      res.status(400).json({
        success: false,
        result: error,
        message: 'CATALOGUE_NOT_FOUND'
      })
    })

    request.end()
  } catch (error) {
    handleError(res, error)
  }
}

const getPlayBackURL = async (req, res) => {
  try {
    const auth =
      'Basic ' +
      Buffer.from(
        process.env.SHEMAROO_USERNAME + ':' + process.env.SHEMAROO_PASSWORD
      ).toString('base64')

    const location = 'IN'

    const data = JSON.stringify({
      auth_token: process.env.SHEMAROO_AUTH_TOKEN,
      region: location,
      catalog_id: req.body.catalog_id,
      content_id: req.body.content_id,
      provider: process.env.SHEMAROO_PROVIDER,
      category: req.body.friendly_id
    })

    const config = {
      method: 'POST',
      maxBodyLength: Infinity,
      url: 'https://prod.web.api.shemaroome.com/ext_get_all_details',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth
      },
      data: data
    }

    axios
      .request(config)
      .then((response) => {
        res.status(200).json({
          success: true,
          result: response.data,
          message: 'FETCHED_SUCCESSFULLY'
        })
      })
      .catch((error) => {
        error.code = 422
        handleError(res, error)
      })
  } catch (error) {
    error.code = 400
    handleError(res, error)
  }
}

module.exports = {
  getShemarooCatalog,
  getShemarooItems,
  getShemarooEpisodes,
  getVideoStream,
  getPlayBackURL
}
