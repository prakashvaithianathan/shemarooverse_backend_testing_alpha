const { handleError } = require('../../middleware/utils')
const countriesDataSet = require('./countries.json')

const getCountries = async (req, res) => {
  try {
    const countriesData = countriesDataSet.data.map((item, i) => {
      return item.country
    })

    res.status(200).json({
      message: null,
      success: true,
      data: countriesData
    })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getCountries }
