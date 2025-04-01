import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import rateLimit from "express-rate-limit";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only!" });
  }
};

export const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 10, 
  message: "Too many requests from this IP, please try again after 5 minutes",
});
