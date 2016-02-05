var express = require("express");
var router = express.Router();
var queries = require("../queries");

router.get("/", function(request, response, next) {
    var beers;

    // Call getBeer function

    response.render("beers", {beers: beers});
});

router.get("/:id", function(request, response, next) {
    var beer;

    // Call getBeer function

    response.send(beer, {beer: beer});
});

module.exports = router;
