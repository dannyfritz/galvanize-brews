var databaseConnection = require("knex")(require("./knexfile")[process.env.NODE_ENV]);

module.exports = {
    getBreweries: function(){
        return databaseConnection("brewery").select();
    },
    getBrewery: function(id){
        return databaseConnection("brewery")
        .first()
        .where("id", id);
    },
    getBeers: function(){
        return databaseConnection("beer")
        .select("beer.name AS beer_name", "brewery.name AS brewery_name", "*")
        .innerJoin("brewery", "brewery_id", "brewery.id");
    },
    getBeersByBrewery: function(brewery_id){
        return databaseConnection("beer")
        .select("beer.name AS beer_name", "brewery.name AS brewery_name", "*")
        .innerJoin("brewery", "brewery_id", "brewery.id")
        .where("brewery_id", brewery_id);
    }
};
