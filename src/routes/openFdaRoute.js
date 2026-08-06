import { Router } from "express";
import { fetchData } from "../controllers/openFdaController.js";

const openFdaRouter = Router();

openFdaRouter.get("/open-fda/search", (req, res) => {
  res.render("search");
});

openFdaRouter.get("/open-fda/result", fetchData);

export default openFdaRouter;
