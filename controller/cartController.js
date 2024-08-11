import userModel from "../models/userModel.js";

// add to the cart
const addToCart = async (req, res) => {
  try {
    const userData = await userModel.findOne({ _id: req.body.userId });
    if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Cart item added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

// remove from cart
const removeFromCart = async(req, res) => {
    try{
        const userData = await userModel.findById(req.body.userId );
     
        let cartData = await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -= 0
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Cart item remove successfully" });
    }catch(error){ 
        console.log(error)
        res.json({ success: false, message: "error" });
    }
};

// get items in the cart
const getCartItems = async(req, res) => {
    try{
        const userData = await userModel.findById(req.body.userId );
        let cartData = await userData.cartData;
        res.json({ success: true, message: "Cart items" ,cartData});
    }catch(error){
        console.log(error)
        res.json({ success: false, message: "failed to fetch cart items" });

    }
};

export { addToCart, removeFromCart, getCartItems };
