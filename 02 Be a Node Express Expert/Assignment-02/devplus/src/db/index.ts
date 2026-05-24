import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool({
  connectionString: config.db_url,
});

pool.on("error", (err, client) => {
  console.log("Unexpected error on idle client", err);
});

const initDB = async () => {
  try {
    await pool.connect();
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error connecting to the database:", err);
  }
};

export { initDB, pool };