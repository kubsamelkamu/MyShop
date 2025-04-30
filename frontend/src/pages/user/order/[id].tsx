/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchOrderById, clearOrderDetails } from '@/store/slices/orderSlice';
import UserLayout from '@/components/user/UserLayout';

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const { orderDetails, loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (typeof id === 'string') {
      dispatch(fetchOrderById(id));
    }
    return () => {
      dispatch(clearOrderDetails());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-16 w-16 border-t-4 border-blue-500 rounded-full" />
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="text-center text-red-500 py-20">{error}</div>
      </UserLayout>
    );
  }

  if (!orderDetails) {
    return (
      <UserLayout>
        <p className="text-center text-red-500 py-20">Order not found.</p>
      </UserLayout>
    );
  }

  const { shippingAddress, orderItems, paymentMethod, paymentStatus, totalPrice, createdAt } = orderDetails;

  return (
    <UserLayout>
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
           <div className="flex justify-between items-center mt-15">
                <span className={`text-sm px-3 py-1 text-blue-700 rounded-full font-medium ${paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {paymentStatus}
                </span>
           </div>
            <p className="text-gray-500">Placed on: {new Date(createdAt).toLocaleString()}</p>
            <section className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-blue-700">Shipping Address</h2>
                <p className="text-gray-700">{shippingAddress.fullName}</p>
                <p className="text-gray-600">{shippingAddress.address}, {shippingAddress.city}</p>
                <p className="text-gray-600">{shippingAddress.postalCode}, {shippingAddress.country}</p>
            </section>
            <section className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-blue-700">Payment</h2>
                <p className="text-gray-700">Method: {paymentMethod}</p>
            </section>
            <section className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-blue-700">Items</h2>
                <div className="divide-y divide-gray-200">
                {orderItems.map(item => (
                    <div key={item.product} className="flex items-center py-4 space-x-4">
                    <img src={item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-gray-500">{item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-semibold text-gray-800">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                ))}
                </div>
            </section>
            <section className="bg-white p-6 rounded-lg shadow border border-gray-100 text-right">
                <p className="text-xl font-semibold text-gray-800">Total: ${totalPrice.toFixed(2)}</p>
            </section>
        </div>
    </UserLayout>
  );
};

export default OrderDetailPage;
