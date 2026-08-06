import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import redisClient from "../config/redis.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "Error, Not authorized to access this route",
      });
    }

    try {
      const isCancelled = await redisClient.get(`blackList_${token}`);
      if (isCancelled) {
        return res.status(401).json({
          status: "failed",
          message: "Error, Invalid Token please Login again",
        });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // decode to get user details from token.
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({
          status: "failed",
          message: "Error, User no Longer Exists",
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          status: "failed",
          message: "Error, User account is deactivated",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        status: "failed",
        message: "Error, Token is invalid or expired",
        error: error.message,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const closeProtect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "Error, Not authorized to access this route",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // decode to get user details from token.
      const currentTime = Math.floor(Date.now() / 1000);
      const ttl = decoded.exp - currentTime;
      if (ttl > 0) {
        await redisClient.setEx(`blackList_${token}`, ttl, "revoked");
      }
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({
          status: "failed",
          message: "Error, User no Longer Exists",
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          status: "failed",
          message: "Error, User account is deactivated",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        status: "failed",
        message: "Error, Token is invalid or expired",
        error: error.message,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "failed",
        message: `Error, role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
