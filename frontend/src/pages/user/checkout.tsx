/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, payOrder } from '@/store/slices/orderSlice';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items } = useSelector((state: RootState) => state.cart);

  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: subtotal }),
    });
    const data = await res.json();
    if (data.error) {
      toast.error(data.error);
      setLoading(false);
      return;
    }
    const clientSecret = data.clientSecret;
    const card = elements.getElement(CardElement)!;
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      const orderItems = items.map(item => ({
        product: (item.product as any)._id,
        name: (item.product as any).name,
        quantity: item.quantity,
        image: (item.product as any).image,
        price: item.price,
      }));

      const createResult = await dispatch(
        createOrder({
          orderItems,
          shippingAddress: shipping,
          paymentMethod: 'Stripe',
          totalPrice: subtotal,
          _id: '',
          user: '',
          paymentStatus: 'Pending',
          orderStatus: 'Pending',
          createdAt: '',
          updatedAt: ''
        })
      );

      if (createOrder.fulfilled.match(createResult)) {
        const newOrder = createResult.payload as any;
        const payResult = await dispatch(
          payOrder({
            orderId: newOrder._id,
            paymentResult: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              update_time: paymentIntent.created?.toString() || new Date().toISOString(),
            }
          })
        );

        if (payOrder.fulfilled.match(payResult)) {
          toast.success('Payment successful and order updated');
        } else {
          toast.warn('Payment processed but failed to update order status');
        }
        router.push(`/user/order/${newOrder._id}`);
      } else {
        toast.error('Failed to place order');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-8 mt-20 bg-white rounded-xl shadow-lg border border-gray-100">
      <div>
        <h3 className="text-lg font-semibold mb-3 mt-6 text-blue-700">Shipping Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {['fullName', 'address', 'city', 'postalCode', 'country'].map(field => (
            <input
              key={field}
              name={field}
              value={(shipping as any)[field]}
              onChange={handleShippingChange}
              required
              placeholder={field.replace(/([A-Z])/g, ' $1')}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full"
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-blue-700">Payment Details</h3>
        <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
        <span className="text-gray-700 font-medium">Total:</span>
        <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg transition disabled:opacity-50"
      >
        {loading ? 'Processing…' : `Pay $${subtotal.toFixed(2)}`}
      </button>
    </form>
  );
};

const CheckoutPage: React.FC = () => (
  <UserLayout>
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  </UserLayout>
);

export default CheckoutPage;

