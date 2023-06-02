const { handleError } = require('../../middleware/utils')
const countriesDataSet = require('./countries.json')

const getCities = async (req, res) => {
  try {
    const countriesData = countriesDataSet.data.filter((item, i) => {
      if (item.country === req.query.country) {
        return item.cities
      }
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

module.exports = { getCities }
