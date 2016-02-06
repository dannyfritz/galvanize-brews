exports.up = function(knex, Promise) {
    return knex.schema.createTable("beer", function(beer){
        beer.increments("id");
        beer.string("name");
        beer.decimal("abv", 2, 1);
        beer.integer("brewery_id").references("brewery", "id");
    });  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("beer"); 
};
