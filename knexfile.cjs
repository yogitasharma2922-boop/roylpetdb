require("dotenv").config();
const path = require("path");

const { DATABASE_URL, SQLITE_FILE } = process.env;
const defaultSqlite = path.resolve(__dirname, "src", "server", "data", "royalpet.db");

module.exports = {
  development: {
    client: DATABASE_URL ? "pg" : "sqlite3",
    connection: DATABASE_URL || {
      filename: SQLITE_FILE || defaultSqlite,
    },
    useNullAsDefault: true,
    migrations: { directory: "./src/server/migrations" },
    seeds: { directory: "./src/server/seeds" },
  },
  production: {
    client: DATABASE_URL ? "pg" : "sqlite3",
    connection: DATABASE_URL || {
      filename: SQLITE_FILE || defaultSqlite,
    },
    useNullAsDefault: true,
    migrations: { directory: "./src/server/migrations" },
    seeds: { directory: "./src/server/seeds" },
  },
};
