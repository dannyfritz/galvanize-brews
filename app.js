require('dotenv').config();
const Express = require("express")
const runner = require("./runner")
const app = Express()

app.set("view engine", "jade")

app.use(Express.static("public"))

app.get("/", (request, response) => {
  runner().then((reports) => {
    response.render("index", {
      reports,
      repo: process.env.GITHUB_REPO,
      user: process.env.GITHUB_USER
    })
  })
})

app.listen(8000)
