import crypto from "crypto";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import { UserService } from "../services/userService.js";
import { sendLoginDetails, sendOTP } from "../helpers/emailHelper.js";
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

//
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

//
const generateOTP = (length = 6) => {
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10);
  }
  return otp;
};

//
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

    // Hash and send to database
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // add expiry time
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10mins * 60 sec * 1000 ms = 600000ms
    await user.save();

    const link = `${process.env.FRONTEND_URL || "http://localhost:5000"}/api/auth/reset-password/${password}`;

    try {
      await sendLoginDetails(user.email, link);
      return res.json({
        status: "success",
        message: "Rest token sent to email",
      });
    } catch (error) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(500).json({
        status: "failed",
        message: "Error sending email. Please try again later",
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, password_confirm } = req.body;

    if (password !== password_confirm) {
      return res.render("changePassword", {
        errors: [
          {
            type: "field",
            value: "invalid-password-match",
            msg: "Password and confirm password do not match",
            path: "password_confirm",
            location: "body",
          },
          {
            type: "field",
            value: "invalid-password-match",
            msg: "Password and confirm password do not match",
            path: "password",
            location: "body",
          },
        ],
        previous: req.body,
        token: token,
      });
    }
    // Hash token to match database record
    const changePasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // find user by token
    const user = await userService.getUserByResetPassword(changePasswordToken);
    if (!user) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid or Expired Token" });
    }
    // update user details
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.isPasswordChanged = true;
    await user.save();
    return res
      .status(201)
      .json({ status: "success", message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const user = await userService.loginUser(req.body);
    const token = generateToken(user.id);
    return res
      .status(200)
      .json({ status: "success", data: { user: user, token: token } });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res.status(400).json({ status: "failed", message: error.message });
    }
    const compare = await user.comparePassword(oldPassword);
    if (!compare) {
      return res.status(401).json({
        status: "failed",
        error: "Password Incorrect",
        message: "Enter Current Password",
      });
    }

    user.password = newPassword;
    await user.save();
    return res
      .status(201)
      .json({ status: "success", message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await userService.confirmEmail(req.body);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: error.message,
      });
    }

    // Generate reset token
    const restToken = generateOTP();

    // Hash and send to database
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(restToken)
      .digest("hex");

    // add expiry time
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10mins * 60 sec * 1000 ms = 600000ms
    await user.save();

    try {
      await sendOTP(user.email, restToken);
      return res.json({
        status: "success",
        message: "Rest token sent to email",
      });
    } catch (error) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(500).json({
        status: "failed",
        message: "Error sending email. Please try again later",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token to match database record
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // find user by token
    const user = await userService.getUserByResetPassword(resetPasswordToken);
    if (!user) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid or Expired Token" });
    }
    // update user details
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res
      .status(201)
      .json({ status: "success", message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // decode to get user details from token.
    const currentTime = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - currentTime;
    if (ttl > 0) {
      await redisClient.setEx(`blackList_${token}`, ttl, "revoked");
    }
    res.status(200).json({
      status: "success",
      message: "logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    const user = await userService.editUser(id, updates);
    res.status(201).json({ status: "success", user: user });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userService.getUserById(id);
    res.status(200).json({ status: "success", user: user });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ status: "success", users: users });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deleted = await userService.deleteUser(id);
    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
