import express, { type Application } from "express";
import fs from "fs";
import { authRoute } from "./modules/auth/auth.route";
import { profileRoute } from "./modules/profile/profile.route";
import { userRoute } from "./modules/user/user.route";
import logger from "./middleware/logger";
const app: Application = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// implement middleware for routes
app.use(logger); // Apply the logger middleware to all routes   


app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

app.use("/api/users", userRoute);

app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);

export default app;
