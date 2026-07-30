import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { serverErrorHandler } from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js";

import { connectDB } from "./config/database.js";

dotenv.config();
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("Welcome to our EMR Project");
// });

app.use("/auth", userRouter);

app.get("/", (req, res) => {
  // Pass empty errors and empty oldInput so the page loads cleanly the first time
  res.render("changePassword", { errors: [], oldInput: {} });
});
app.use((req, res) => {
  res.status(404).json({
    status: "failed",
    message: "Route not found",
  });
});

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port:http://localhost:${PORT}`);
    });
  } catch (error) {
    serverErrorHandler(error);
  }
};

startServer();
