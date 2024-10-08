import foodModel from "../models/foodModel.js";
import fs from "fs";
import { uploadToCloudinary } from "../utls/cloudinary.js";

// add food controller
const addFood = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Upload image to Cloudinary
  const imageUrl = await uploadToCloudinary(req.file.buffer);
  try {
    // const image_filename = `${req.file.filename}`;
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: imageUrl,
    });

    await food.save();
    if (food) {
      res
        .status(200)
        .json({ success: true, message: "food created successfuly", food });
    } else {
      res
        .status(400)
        .json({ success: false, message: "food created unsuccessful" });
    }
  } catch (error) {
    console.log({ success: false, message: "error" });
  }
};

// get all food items available
const listFood = async (req, res) => {
  try {
    const foodList = await foodModel.find({});
    if (foodList) {
      res.json({ success: true, message: "all food available", foodList });
    }
  } catch (error) {
    console.log({ success: false, message: "No foodall food available" });
  }
};

// remove food items
const delFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "food item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "food item not found" });
  }
};

export { addFood, listFood, delFood };
