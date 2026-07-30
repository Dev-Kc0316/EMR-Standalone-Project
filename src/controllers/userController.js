import crypto from "crypto";
import redisClient from "../config/redis.js";
import { UserService } from "../services/userService.js";
import { sendLoginDetails } from "../helpers/emailHelper.js";
import { link } from "fs";
const userService = new UserService();

const generatePassword = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars[crypto.randomInt(0, chars.length)];
  }

  return password;
};
export const register = async (req, res, next) => {
  const password = generatePassword();
  try {
    const user = await userService.createUser(req.body, password);
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "User not created",
      });
    }

    const link = " ";
    await sendLoginDetails(user.email, link);

    return res.status(201).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
