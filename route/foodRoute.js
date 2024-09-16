import express from "express";
import { addFood, delFood, listFood } from "../controller/foodController.js";
import upload from "../middleware/multer.js"

const foodRouter = express.Router();

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/allFood", listFood);
foodRouter.post("/delFood", delFood);
 
export default foodRouter;
