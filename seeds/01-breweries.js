exports.seed = function(knex, Promise) {
    return Promise.all([
        knex("brewery").del(), 

        knex("brewery").insert({
            name: "Comrade",
            city: "Denver",
            state: "CO"
        }),
        knex("brewery").insert({
            name: "Ska",
            city: "Durango",
            state: "CO"
        })
    ]);
};
