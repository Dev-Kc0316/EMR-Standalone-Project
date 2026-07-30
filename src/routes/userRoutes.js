import { Router } from "express";
import { register } from "../controllers/userController.js";
import { validateNewUser } from "../middlewares/validationMiddleware.js";

const userRouter = Router();

userRouter.post("/register", validateNewUser, register);

export default userRouter;
