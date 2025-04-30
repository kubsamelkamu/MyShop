import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchUserOrders } from '@/store/slices/orderSlice';
import UserLayout from '@/components/user/UserLayout';
import Link from 'next/link';

const OrdersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

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

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600">You have no past orders.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order._id} href={`/order/${order._id}`} 
               className="block bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order ID: {order._id}</p>
                      <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p>Total: <span className="font-semibold">${order.totalPrice.toFixed(2)}</span></p>
                      <p>Status: <span className={order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}>{order.paymentStatus}</span></p>
                    </div>
                  </div>
               
              </Link>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default OrdersPage;
