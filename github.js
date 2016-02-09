require('dotenv').config();
const GitHubApi = require("github")
const utils = require("./utils")
const DEPLOYEDURL_FILE = `.deployedurl`

const github = new GitHubApi({
  version: "3.0.0",
  protocol: "https"
})

github.authenticate({
  type: "oauth",
  token: process.env.GITHUB_ACCESS_TOKEN
})

const getPullRequests = (user, repo) =>
  new Promise((resolve, reject) => {
    github.pullRequests.getAll({
      user: process.env.GITHUB_USER,
      repo: process.env.GITHUB_REPO,
      status: "open"
    }, (error, data) => {
      if (error) reject(error)
      if (data) resolve(data)
    })
  })

const getPullRequestUser = (pullRequest) => pullRequest.head.repo.owner.login
const getPullRequestRepoUrl = (pullRequest) => pullRequest.head.repo.html_url
const getDeployedUrl = (pullRequest) => {
  const user = pullRequest.head.repo.owner.login
  const repo = pullRequest.head.repo.name
  const branch = pullRequest.head.ref
  return utils.getHtml(`https://raw.githubusercontent.com/${user}/${repo}/${branch}/${DEPLOYEDURL_FILE}`)
}

module.exports = {
  getPullRequestUser,
  getDeployedUrl,
  getPullRequests
}
