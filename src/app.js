import express from "express";
import dotenv from "dotenv";
import { serverErrorHandler } from "./middlewares/errorMiddleware.js";

import { connectDB } from "./config/database.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to our EMR Project");
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
