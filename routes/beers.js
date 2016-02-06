var express = require("express");
var router = express.Router();
var queries = require("../queries");

router.get("/", function(request, response, next) {
    var beers;
    // Query for beers here
    response.render("beers", {beers: beers});
});

module.exports = router;
