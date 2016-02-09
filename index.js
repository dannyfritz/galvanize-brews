const chai = require("chai")
const axios = require("axios")
const cheerio = require("cheerio")
const _ = require("lodash")
const config = require("./config.json")
const data = require("./data.json")

const getHtmlFromResponse = (response) => response.data
const getHtml = (url) =>
  axios.get(url)
    .then(getHtmlFromResponse)
const log = (value) => {
  console.log(value)
  return value
}

const reportFormatter = (name) => {
  return (results) => {
    const passed = _.compact(results).length
    return [name, passed, results.length - passed]
  }
}

const testSubmission = (submission) =>
  Promise.all([
    Promise.resolve(submission.name),
    testBeers(submission.url).then(reportFormatter("beers")),
    testBreweries(submission.url).then(reportFormatter("breweries")),
    testSkaBrews(submission.url).then(reportFormatter("skaBrews")),
    testComradeBrews(submission.url).then(reportFormatter("comradeBrews"))
  ])

const testBeers = (url) =>
  getBeers(url)
    .then((brews) => {
      const masterBrews = _.clone(data.brews)
      console.log(brews.length === masterBrews.length)
      const matches = brews.map((brew) => {
        const match = _.find(masterBrews, (masterBrew) => brewsEqual(masterBrew, brew))
        if (!!match) {
          _.remove(masterBrews, match)
        }
        return !!match
      })
      return matches
    })
const testBreweries = (url) => Promise.resolve([])
const testSkaBrews = (url) => Promise.resolve([])
const testComradeBrews = (url) => Promise.resolve([])

const getBeers = (url) =>
  getHtml(`${url}beers`)
  .then((html) => {
      const $ = cheerio.load(html)
      const columns = _.keys(_.first(data.brews))
      const $beerRows = $("tr ~ tr")
      return $beerRows.toArray().map((tr) => {
        return _.zipObject(columns, $(tr).find("td").toArray().map((td) => {
          return $(td).text()
        }))
      })
  })
const getBreweries = (url) => {}
const getSkaBrews = (url) => {}
const getComradeBrews = (url) => {}

const brewsEqual = (brew1, brew2) => {
  if (_.lowerCase(brew1.name) !== _.lowerCase(brew2.name)) {
    return false
  }
  else if (_.toNumber(brew1.abv) !== _.toNumber(brew2.abv)) {
    return false
  }
  else if (_.lowerCase(brew1.brewery) !== _.lowerCase(brew2.brewery)) {
    return false
  }
  return true
}

const runner = (config) => {
  console.log(`Starting tests for ${config.project}`)
  Promise.all(config.submissions.map(testSubmission))
    .then(log)
    .catch(log)
}

runner(config)
