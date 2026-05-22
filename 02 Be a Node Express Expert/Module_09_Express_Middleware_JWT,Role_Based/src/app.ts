import express, { type Application, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import { authRoute } from "./modules/auth/auth.route";
import { profileRoute } from "./modules/profile/profile.route";
import { userRoute } from "./modules/user/user.route";
import logger from "./middleware/logger";
import CookieParser from "cookie-parser";
import cors from "cors";
const app: Application = express();

app.use(CookieParser());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// implement middleware for routes
app.use(logger); // Apply the logger middleware to all routes   

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allowed headers
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions)); // Enable CORS for all routes (you can configure it as needed)
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);
// Global Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
export default app;
