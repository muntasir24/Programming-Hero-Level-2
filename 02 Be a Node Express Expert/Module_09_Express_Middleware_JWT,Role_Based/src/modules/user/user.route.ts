import { Router, type NextFunction, type Request, type Response} from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";


const router=Router();






router.post("/", userController.createUser);
router.get("/",auth(), userController.getAllUsers);
router.get("/:id", auth(), userController.getUserById);
router.put("/:id", auth(), userController.updateUser);
router.delete("/:id", auth(), userController.deleteUser);


export const userRoute=router;