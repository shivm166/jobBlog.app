import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error("All fields are required!");
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      const error = new Error("User already exists! Try again.");
      error.statusCode = 409;
      throw error;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const regUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      regUser,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("All fields are required!");
    }

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User Emial not  exists! Try again.");
      error.statusCode = 409;
      throw error;
    }

    const isPassmatch = await bcrypt.compare(password, user.password);

    if (!isPassmatch) {
      const error = new Error("User Password not  exists! Try again.");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({ ID: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    next(err);
  }
};
