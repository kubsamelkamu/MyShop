import express from "express";
import Stripe from "stripe";
import Order from "../models/orderModel.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { protect, admin } from "../middleware/authMiddleware.js";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (orderItems.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.body.paymentStatus) {
      order.paymentStatus = req.body.paymentStatus;
    }
    if (req.body.orderStatus) {
      order.orderStatus = req.body.orderStatus;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id/pay", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "Paid";
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Payment Update Failed", error: error.message });
  }
});

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      try {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = "Paid";
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
            email_address: paymentIntent.receipt_email,
          };
          await order.save();
          console.log(`✅ Order ${orderId} marked as Paid`);
        } else {
          console.log(`⚠️ Order not found: ${orderId}`);
        }
      } catch (error) {
        console.error("❌ Error updating order status:", error.message);
      }
      break;

    case "payment_intent.payment_failed":
      console.log("❌ Payment Failed:", event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

export default router;
