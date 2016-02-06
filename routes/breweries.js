var express = require("express");
var router = express.Router();
var queries = require("../queries");

router.get("/", function(request, response, next) {
    queries.getBreweries()
    .then(function(breweries){
        response.render("breweries", {breweries: breweries});
    });
});

router.get("/:id/beers", function(request, response, next) {
    queries.getBeersByBrewery(request.params.id)
    .then(function(beers){
        response.render("beers", {beers: beers});
    });
});

module.exports = router;
