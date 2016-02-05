var express = require("express");
var router = express.Router();
var queries = require("../queries");

router.get("/", function(request, response, next) {
    var breweries;

    // call getBrewery

    response.render("index", {breweries: breweries});
});

module.exports = router;
