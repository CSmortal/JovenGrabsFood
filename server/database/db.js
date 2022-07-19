const Pool = require('pg').Pool
require('dotenv').config()

module.exports = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  port: process.env.PG_PORT,
})