import { Pool } from "pg";
import {config} from "../config";
const pool = new Pool({
  connectionString:config.databaseUrl, // Sensitive data hidden!
});

const initDB = async () => {
  try {
    await pool.connect();
    await pool.query(`
      
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      `);
    console.log("Connected to the database successfully!");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
};

export { pool, initDB };