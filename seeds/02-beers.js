exports.seed = function(knex, Promise) {
    return Promise.all([
        knex("beer").del(), 

        knex("brewery")
            .first("id")
            .where("name", "Comrade")
            .then(function(brewery){
                return Promise.all([
                    knex("beer").insert({
                        name: "Yellow Fever",
                        abv: 5.0,
                        brewery_id: brewery.id
                    }),
                    knex("beer").insert({
                        name: "Redcon",
                        abv: 5.7,
                        brewery_id: brewery.id
                    })
                ]);
            }),
        knex("brewery")
            .first("id")
            .where("name", "Ska")
            .then(function(brewery){
                return Promise.all([
                    knex("beer").insert({
                        name: "True Blonde Ale",
                        abv: 5.0,
                        brewery_id: brewery.id
                    }),
                    knex("beer").insert({
                        name: "Modus Hoperandi IPA",
                        abv: 6.8,
                        brewery_id: brewery.id
                    })
                ]);
            }),
    ]);
};
