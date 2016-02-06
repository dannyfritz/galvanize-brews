require("dotenv").load();

module.exports = {
    development: {
        client: "pg",
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        }
    },
    production: {
        client: "pg",
        connection: process.env.DATABASE_URL
    }
};
