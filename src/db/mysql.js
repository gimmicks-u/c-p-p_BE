const mysql = require('mysql2/promise');
const config = require('../../config/mysql/config');

const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  port: config.port,
  password: config.password,
  database: config.database,
});

module.exports = { pool };
