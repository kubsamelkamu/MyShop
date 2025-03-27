import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { protect } from "../middleware/authMiddleware.js"; 

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", protect, async (req, res) => {
  try {
    const { amount } = req.body; 

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"], 
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: "Payment Failed", error: error.message });
  }
});

export default router;
