exports.up = function(knex, Promise) {
    return knex.schema.createTable("brewery", function(brewery){
        brewery.increments("id");
        brewery.string("name");
        brewery.string("city");
        brewery.string("state");
    });  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("brewery"); 
};
