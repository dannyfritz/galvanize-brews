var express = require("express");
var router = express.Router();
var queries = require("../queries");

router.get("/", function(request, response, next) {
    var breweries;
    // Query for breweries here
    response.render("breweries", {breweries: breweries});
});

router.get("/:id/beers", function(request, response, next) {
    var beers;
    // Query for beers by brewery here
    response.render("beers", {beers: beers});
});

module.exports = router;
