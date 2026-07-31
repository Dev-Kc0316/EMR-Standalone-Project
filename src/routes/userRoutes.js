import { Router } from "express";
import {
  register,
  changePassword,
  login,
  updatePassword,
  forgotPassword,
  resetPassword,
  logout,
  updateUser,
  getUser,
  getAllUsers,
  deleteUser,
} from "../controllers/userController.js";
import {
  validateNewUser,
  validateChangePassword,
  validateCurrentUser,
  validateUpdatePassword,
  validatePassword,
  validateUpdateUser,
} from "../middlewares/validationMiddleware.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.post(
  "/register",
  protect,
  authorize("admin"),
  validateNewUser,
  register,
);

userRouter.get("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  // Pass empty errors and empty oldInput so the page loads cleanly the first time
  res.render("changePassword", {
    errors: [],
    previous: {},
    token: token,
  });
});

userRouter.post(
  "/change-password/:token",
  validateChangePassword,
  changePassword,
);

userRouter.post("/login", validateCurrentUser, login);

userRouter.put(
  "/update-password",
  protect,
  validateUpdatePassword,
  updatePassword,
);

userRouter.post("/forget-password", forgotPassword);

userRouter.put("/reset-password-otp/:token", validatePassword, resetPassword);

userRouter.post("/logout", protect, logout);

userRouter.put(
  "/update-user/:id",
  protect,
  authorize("admin"),
  validateUpdateUser,
  updateUser,
);

userRouter.get("/all-users", protect, authorize("admin"), getAllUsers);

userRouter.get("/user/:id", protect, authorize("admin"), getUser);

userRouter.delete("/delete-user/:id", protect, authorize("admin"), deleteUser);

export default userRouter;
