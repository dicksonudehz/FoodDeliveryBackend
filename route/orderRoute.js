import express from "express";
import { listOrder, placeOrder, updateStatus, userOrder, verifyOrder } from "../controller/orderController.js";
import authMiddleWare from "../middleware/auth.js";

const orderRouter = express.Router();


orderRouter.post("/place", authMiddleWare, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userOrders", authMiddleWare, userOrder);
orderRouter.get("/list", listOrder);
orderRouter.post("/status", updateStatus);
 
export default orderRouter;
