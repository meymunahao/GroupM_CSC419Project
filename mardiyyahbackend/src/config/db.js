import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.query("SELECT 1")
  .then(() => console.log("✅ Connected to Neon PostgreSQL"))
  .catch(err => console.error("❌ DB connection error", err));

export default pool;
