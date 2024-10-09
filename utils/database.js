const { Client: PgClient } = require('pg');

// Initialize PostgreSQL client
const pgClient = new PgClient({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    port: process.env.PGPORT,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
});

module.exports = { pgClient }