import express from "express";
import Wishlist from "../models/wishListModel.js";
import Product from "../models/productmodel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("items.product");
    if (!wishlist) {
      return res.json({ items: [] });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", protect, async (req, res) => {
  const { product } = req.body;

  try {
    if (!product) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const foundProduct = await Product.findById(product);
    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
    }

    const exists = wishlist.items.find((item) => item.product.toString() === product);
    if (exists) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    wishlist.items.push({ product });
    const updatedWishlist = await wishlist.save();
    res.status(201).json(updatedWishlist);
  } catch (error) {
    res.status(500).json(error.message);
  }
});


router.delete("/:productId", protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    const updatedWishlist = await wishlist.save();
    res.json({ message: "Product removed from wishlist", updatedWishlist });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/", protect, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Wishlist cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
