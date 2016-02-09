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
      const matches = brews.map((brew) => {
        const match = _.find(masterBrews, (masterBrew) => brewsEqual(masterBrew, brew))
        if (!!match) {
          _.remove(masterBrews, match)
        }
        return !!match
      })
      matches.unshift(brews.length === data.brews.length)
      return matches
    })
const testBreweries = (url) =>
  getBreweries(url)
  .then((breweries) => {
    const masterBreweries = _.clone(data.breweries)
    const matches = breweries.map((brewery) => {
      const match = _.find(masterBreweries, (masterBrewery) => breweriesEqual(masterBrewery, brewery))
      if (!!match) {
        _.remove(masterBreweries, match)
      }
      return !!match
    })
    matches.unshift(breweries.length === data.breweries.length)
    return matches
  })
  .then(log)
const testSkaBrews = (url) => Promise.resolve([])
const testComradeBrews = (url) => Promise.resolve([])

const getBeers = (url) =>
  getHtml(`${url}beers`)
  .then((html) => {
      const $ = cheerio.load(html)
      const $beerRows = $("tr ~ tr")
      return $beerRows.toArray().map((tr) => {
        const $td = $(tr).find("td")
        return {
          brewery: $td.eq(0).text(),
          name: $td.eq(1).text(),
          abv: $td.eq(2).text()
        }
      })
  })
const getBreweries = (url) =>
  getHtml(`${url}breweries`)
  .then((html) => {
    const $ = cheerio.load(html)
    const $breweryLis = $("li")
    return $breweryLis.toArray().map((li) => {
      return {
        name: $(li).find("a").text(),
        location: $(li).text().replace(/^[^,]*,\s/, "")
      }
    })
  })

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
const breweriesEqual = (brewery1, brewery2) => {
  if (_.lowerCase(brewery1.name) !== _.lowerCase(brewery2.name)) {
    return false
  }
  else if (_.lowerCase(brewery1.location) !== _.lowerCase(brewery2.location)) {
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
