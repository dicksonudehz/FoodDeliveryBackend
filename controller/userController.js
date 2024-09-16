import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({ success: true, message: "user doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.json({ success: false, message: "password do not match" });
    } else {
      const token = createToken(user._id);
      res.json({ success: true, message: "user login successful", token });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "failed to login user" });
  }
};
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await userModel.findOne({ email });

    //   verify if the email exist
    if (userEmail) {
      res.json({ success: false, message: "user already exist" });
    }
    if (!validator.isEmail(email)) {
      res.json({ success: false, message: "please enter a valid email" });
    }
    //   verify if the password is strong
    if (password.length < 8) {
      res.json({ success: false, message: "Enter a stronger Password" });
    }
    //   hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, message: "registration successful", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "registration not complete" });
  }
};

export { loginUser, registerUser };
