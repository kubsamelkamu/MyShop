/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/admin/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchOrderById } from "@/store/slices/orderSlice";
import Link from "next/link";

const OrderDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();

  const { orderDetails, loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(fetchOrderById(id));
    }
  }, [id, dispatch]);

  return (
    <AdminLayout>
      <div className="p-4 border-blue-800 border rounded shadow bg-white">
        <Link href="/admin/orders" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Orders
        </Link>
        {loading && <p>Loading order details...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {orderDetails && (
          <div className="space-y-6">
            <div className="p-4 border border-blue-800 rounded shadow bg-white">
              <h2 className="text-xl font-semibold mb-2 text-blue-500">Order Summary</h2>
              <p><strong>Order ID:</strong> {orderDetails._id}</p>
              <p><strong>Status:</strong> <span className={
                orderDetails.orderStatus === "Delivered"
                  ? "text-green-600"
                  : orderDetails.orderStatus === "Pending"
                  ? "text-yellow-600"
                  : orderDetails.orderStatus === "Cancelled"
                  ? "text-red-600"
                  : "text-blue-600"
              }>{orderDetails.orderStatus}</span></p>
              <p><strong>Total Price:</strong> ${orderDetails.totalPrice.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>
              <p><strong>Payment Status:</strong> {orderDetails.paymentStatus}</p>
              <p><strong>Ordered On:</strong> {new Date(orderDetails.createdAt).toLocaleString()}</p>
              <p><strong>Last Updated:</strong> {new Date(orderDetails.updatedAt).toLocaleString()}</p>
            </div>

            <div className="p-4 border border-blue-800 rounded shadow bg-white">
              <h2 className="text-xl font-semibold mb-2 text-blue-500">Shipping Address</h2>
              <p>{orderDetails.shippingAddress.fullName}</p>
              <p>
                {orderDetails.shippingAddress.address}, {orderDetails.shippingAddress.city}
              </p>
              <p>
                {orderDetails.shippingAddress.postalCode}, {orderDetails.shippingAddress.country}
              </p>
            </div>

            <div className="p-4 border border-blue-800 rounded shadow bg-white">
              <h2 className="text-xl font-semibold mb-4 text-blue-500">Items Ordered</h2>
              {orderDetails.orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 border-b py-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;
