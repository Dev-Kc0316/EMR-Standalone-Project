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
