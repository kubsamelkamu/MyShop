import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js"; 
import User from "../models/UserModel.js";

const router = express.Router();

router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
