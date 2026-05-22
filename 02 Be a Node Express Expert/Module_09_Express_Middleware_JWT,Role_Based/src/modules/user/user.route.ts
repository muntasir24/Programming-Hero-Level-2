import { Router, type NextFunction, type Request, type Response} from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";


const router=Router();





router.post("/", userController.createUser);
router.get("/",auth(USER_ROLE.ADMIN, USER_ROLE.AGENT, USER_ROLE.USER), userController.getAllUsers);
router.get("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.AGENT, USER_ROLE.USER), userController.getUserById);
router.put("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.AGENT, USER_ROLE.USER), userController.updateUser);
router.delete("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.AGENT, USER_ROLE.USER), userController.deleteUser);


export const userRoute=router;