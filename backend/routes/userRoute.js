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

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body; 

    if (!id || typeof isAdmin === "undefined") {
      return res.status(400).json({ message: "Missing parameters" });
    }
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = isAdmin;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete("/:id", protect, admin, async (req, res)=> {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
