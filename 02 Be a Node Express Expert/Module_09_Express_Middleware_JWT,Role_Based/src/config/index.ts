import dotenv from "dotenv";
import path from "path";
dotenv.config(
    {
        path:path.join(process.cwd(), ".env")
    }
);

export const config = {
  port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL, // Sensitive data hidden!
  secret: process.env.JWT_SECRET || "your_secret_key", // Sensitive data hidden!
};