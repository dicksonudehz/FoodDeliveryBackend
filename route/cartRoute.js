import express from "express";
import { addToCart, removeFromCart, getCartItems} from "../controller/cartController.js";
import authMiddleWare from "../middleware/auth.js";

const cartRouter = express.Router();



cartRouter.post("/add", authMiddleWare, addToCart);
cartRouter.post("/remove", authMiddleWare, removeFromCart);
cartRouter.post("/get", authMiddleWare, getCartItems);
 
export default cartRouter
