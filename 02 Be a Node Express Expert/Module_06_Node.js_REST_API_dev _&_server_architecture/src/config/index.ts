import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const config = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL || "mongodb://localhost:27017/myapp",
};

export default config;