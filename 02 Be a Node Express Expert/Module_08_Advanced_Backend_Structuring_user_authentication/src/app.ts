import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { config } from "./config";
import { initDB, pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
const app: Application = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});


app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies


app.use('/api/users',userRoute);

app.use("/api/profile",profileRoute);
app.use("/api/auth", authRoute);



export default app;
