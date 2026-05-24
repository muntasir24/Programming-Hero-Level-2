import { Router } from "express";
import { userController } from "./auth.controller";

const router = Router();

router.post("/signup", userController.createUser);

export const userRoute = router;
