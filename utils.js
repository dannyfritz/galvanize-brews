const axios = require("axios")
const logSymbols = require('log-symbols');
const _ = require("lodash")

const getHtml = (url) =>
  axios.get(url)
    .then(getHtmlFromResponse)

const getHtmlFromResponse = (response) => response.data

const log = (value) => {
  console.log(value)
  return value
}

const resultsReporter = (results) => {
  return results.map((result) => {
    const name = result[0]
    const rollup = resultRollup(result)
    const symbol = rollup.failing ? logSymbols.error : logSymbols.success
    console.log(`${symbol} ${name}, passing: ${rollup.passing}, failing: ${rollup.failing}`)
    rollup.name = name
    return rollup
  })
}

const resultRollup = (result) =>
  _.tail(result).reduce((rollup, result) => {
    rollup.passing += result[1]
    rollup.failing += result[2]
    return rollup
  }, {passing: 0, failing: 0})

const resultFormatter = (name) => {
  return (results) => {
    const passed = _.compact(results).length
    return [name, passed, results.length - passed]
  }
}

module.exports = {
  getHtml,
  log,
  resultsReporter,
  resultFormatter
}
