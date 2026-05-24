import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { errorHandler } from "./middleware/errorHandler";
import { userRoute } from "./modules/auth/auth.route";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(express.json()); //body parser to parse json

app.use("/api/auth", userRoute);

app.use(errorHandler);

export default app;
