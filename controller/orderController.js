import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontendUrl = "http://localhost:3000";
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "delivery charge",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
    });
    res.json({
      success: true,
      success_url: session.url,
      message: "your order is place",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "order failed" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "not paid" });
    }
  } catch (error) {
    console.log("error");
  }
};

const userOrder = async (req, res) => {
  try {
    const order = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, data: error });
  }
};

const listOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, data: "error" });
  }
};

const updateStatus = async (req, res) => {
  try {
   const updatedStatus = await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "status updated", status: updatedStatus});
  } catch (error) {
    console.log(error);
    res.json({ success: false, data: "error" });
  }
};

export { placeOrder, verifyOrder, userOrder, listOrder, updateStatus };
