import express from "express";
import Cart from "../models/cartModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { product, quantity, price } = req.body;

    if (!product || !quantity || !price) {
      return res.status(400).json({ message: "All fields (product, quantity, price) are required" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === product);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product, quantity, price });
    }
    const updatedCart = await cart.save();
    res.status(201).json(updatedCart);

  } catch (error) {
    res.status(500).json(error.message);
  }
});


router.put("/:productId", protect, async (req, res) => {
  const { quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.product.toString() === req.params.productId);
    
    if (item) {
      item.quantity = quantity;
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:productId", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);

    const updatedCart = await cart.save();
    res.json({ message: "Item removed", updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.delete("/", protect, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
