var express = require("express");
var router = express.Router();
var queries = require("../queries");

router.get("/", function(request, response, next) {
    var breweries;

    // Call getBrewery

    response.render("breweries", {breweries: breweries});
});

router.get("/:id/beers", function(request, response, next) {
    var beers;

    // Call getBrewery and then call getBeersFromBrewery using a promise chain

    response.render("beers", {beers: beers});
});

router.get("/:id", function(request, response, next) {
    var brewery;

    // Call getBrewery

    response.render("breweries", {brewery: brewery});
});

module.exports = router;
