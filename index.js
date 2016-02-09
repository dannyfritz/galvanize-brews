require('dotenv').config();
const logSymbols = require('log-symbols');
const _ = require("lodash")
const data = require("./data.json")
const github = require("./github")
const brew = require("./brewTests")
const utils = require("./utils")

const getSubmissions = () =>
  github.getPullRequests(process.env.GITHUB_USER, process.env.GITHUB_REPO)
    .then((pullRequests) =>
      Promise.all(
        pullRequests.map((pullrequest) =>
          github.getDeployedUrl(pullrequest)
            .then((deployedUrl) => ({
              name: github.getPullRequestUser(pullrequest),
              url: deployedUrl.trim()
            }))
        )
      )
    )

const runner = () => {
  console.log(`${logSymbols.info} Starting tests`)
  getSubmissions()
    .then((submissions) => Promise.all(submissions.map(brew.testSubmission)))
    .then(utils.resultsReporter)
    .catch((reason) => {
      console.log(`${logSymbols.error} Error`)
      console.error(reason)
    })
}

runner()
