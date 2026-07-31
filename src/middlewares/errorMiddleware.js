import sequelize from "../config/database.js";

// function to close Database connection if there is a Server Connection Error
export async function serverErrorHandler(error) {
  console.error("Failed to start server, Error:", error);
  try {
    await sequelize.close();
    console.log("Connection closed Successfully");
  } catch (dberror) {
    console.error("Error closing the database connection:", dberror);
  } finally {
    process.exit(1);
  }
}

// error handle function

const errorHandler = (err, req, res, next) => {
  if (!err.status || err.status === 500) {
    console.error("Unhandled Error:", err);
  }
  // sequelize unique constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors[0].path;
    return res.status(409).json({
      status: "failed",
      error: "Conflict",
      message: `${field} already exists`,
      // this means that there is a conflict. caused by the unique nature of email and phone number
    });
  }

  // sequelize validation error
  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      status: "failed",
      message: "Validation error",
      errors,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ status: "failed", message: "Invalid Token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ status: "failed", message: "Token Expired" });
  }

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      status: "failed",
      message: "File too large",
    });
  }

  // default error if no other error code was found
  res.status(err.status || 500).json({
    status: "failed",
    message: err.message || "Internal server error",
  });
};

export default errorHandler;
