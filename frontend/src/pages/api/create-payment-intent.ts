/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { amount, orderId } = req.body;
  if (typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),  
      currency: 'usd',
      metadata: { orderId },
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
}
