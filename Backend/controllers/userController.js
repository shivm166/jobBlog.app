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

    // 1. Validate input
    if (!email || !password) {
      const error = new Error("All fields are required!");
      error.statusCode = 400;
      throw error;
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User email does not exist! Try again.");
      error.statusCode = 404;
      throw error;
    }

    // 3. Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      const error = new Error("Incorrect password! Try again.");
      error.statusCode = 401;
      throw error;
    }

    // 4. Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 5. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // 6. Send response
    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token, // optional if you already use cookies
    });
  } catch (err) {
    next(err); // Pass error to global error middleware
  }
};

export const profile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      const error = new Error("User not found. Please login again.");
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ message: "User profile fetched", user });
  } catch (err) {
    next(err);
  }
};
