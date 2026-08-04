// backend/db/index.js
// Database pool helper using pg. Expects DATABASE_URL in env.

const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
