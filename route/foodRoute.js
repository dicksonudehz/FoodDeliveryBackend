import express from "express";
import multer from "multer";
import { addFood, delFood, listFood } from "../controller/foodController.js";

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const uploads = multer({ storage: storage });
foodRouter.post("/add", uploads.single("image"), addFood);
foodRouter.get("/allFood", listFood);
foodRouter.post("/delFood", delFood);
 
export default foodRouter;
