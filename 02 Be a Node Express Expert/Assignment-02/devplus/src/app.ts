import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { errorHandler } from "./middleware/errorHandler";
import { authRoute } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(express.json()); //body parser to parse json
app.use(cookieParser());
app.use("/api/auth", authRoute);


app.use(errorHandler);

export default app;
