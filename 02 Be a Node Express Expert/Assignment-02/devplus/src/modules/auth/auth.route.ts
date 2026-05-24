import { Router } from "express";
import { userController } from "./auth.controller";

const router = Router();

router.post("/signup", userController.createUser);
router.post("/login",userController.loginUser);
router.post("/refresh",userController.refreshToken);
export const authRoute = router;
