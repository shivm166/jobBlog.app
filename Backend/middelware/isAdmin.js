import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const isAdmin = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.log(decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("isAdmin Middleware Error:", err.message);
    res.status(401).json({ message: "Unauthorized or invalid token" });
  }
};

export default isAdmin;
