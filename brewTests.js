const cheerio = require("cheerio")
const logSymbols = require('log-symbols');
const _ = require("lodash")
const utils = require("./utils")

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

const testSkaBrews = (url) =>
  getSkaBrews(url)
  .then((brews) => {
    const masterBrews = _.filter(_.clone(data.brews), {brewery: "Ska"})
    const matches = brews.map((brew) => {
      const match = _.find(masterBrews, (masterBrew) => brewsEqual(masterBrew, brew))
      if (!!match) {
        _.remove(masterBrews, match)
      }
      return !!match
    })
    matches.unshift(brews.length === _.filter(data.brews, {brewery: "Ska"}).length)
    return matches
  })

const testComradeBrews = (url) =>
  getComradeBrews(url)
  .then((brews) => {
    const masterBrews = _.filter(_.clone(data.brews), {brewery: "Comrade"})
    const matches = brews.map((brew) => {
      const match = _.find(masterBrews, (masterBrew) => brewsEqual(masterBrew, brew))
      if (!!match) {
        _.remove(masterBrews, match)
      }
      return !!match
    })
    matches.unshift(brews.length === _.filter(data.brews, {brewery: "Comrade"}).length)
    return matches
  })

const parseBeerTable = (html) => {
  const $ = cheerio.load(html)
  const $beerRows = $("tr ~ tr")
  return $beerRows.toArray().map((tr) => {
    const $td = $(tr).find("td")
    return parseBeerTds($td)
  })
}

const parseBeerTds = ($tds) => ({
  brewery: $tds.eq(0).text(),
  name: $tds.eq(1).text(),
  abv: $tds.eq(2).text()
})

const getBeers = (url) =>
  utils.getHtml(`${url}beers`)
  .then(parseBeerTable)

const getBreweries = (url) =>
  utils.getHtml(`${url}breweries`)
  .then((html) => {
    const $ = cheerio.load(html)
    const $breweryLis = $("li")
    return $breweryLis.toArray().map((li) => {
      return {
        name: $(li).find("a").text(),
        location: $(li).text().replace(/^[^,]*,\s/, ""),
        path: $(li).find("a").attr("href").replace(/^\//, "")
      }
    })
  })

const getSkaBrews = (url) =>
  getBreweries(url)
  .then((breweries) => {
    const brewery = _.find(breweries, {name: "Ska"})
    return utils.getHtml(`${url}${brewery.path}`)
  })
  .then(parseBeerTable)

const getComradeBrews = (url) =>
  getBreweries(url)
  .then((breweries) => {
    const brewery = _.find(breweries, {name: "Comrade"})
    return utils.getHtml(`${url}${brewery.path}`)
  })
  .then(parseBeerTable)

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

const testSubmission = (submission) =>
  Promise.all([
    Promise.resolve(submission.name),
    testBeers(submission.url).then(utils.resultFormatter("beers")),
    testBreweries(submission.url).then(utils.resultFormatter("breweries")),
    testSkaBrews(submission.url).then(utils.resultFormatter("skaBrews")),
    testComradeBrews(submission.url).then(utils.resultFormatter("comradeBrews"))
  ])
  .catch((reason) => {
    console.log(`${logSymbols.error} Error when running test for ${submission.name}`)
    console.error(reason)
  })

module.exports = {
  testSubmission
}
