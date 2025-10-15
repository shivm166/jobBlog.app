import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    // ✅ Use optional chaining to avoid reading undefined
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // ✅ Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Match the payload key with what you used in login (id, not ID)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
