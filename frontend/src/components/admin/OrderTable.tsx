import React from "react";
import { FiEye, FiEdit } from "react-icons/fi";

export interface Order {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
}

interface OrderTableProps {
  orders: Order[];
  onView: (orderId: string) => void;
  onEdit: (orderId: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onView, onEdit }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Order ID</th>
            <th className="py-2 px-4 text-left">User</th>
            <th className="py-2 px-4 text-left">Total Price</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
        {orders.map(order => {
          const userName =
            order.user && typeof order.user === "object"
              ? order.user.name
              : typeof order.user === "string"
              ? order.user
              : "Unknown";

          return (
            <tr key={order._id} className="border-b">
              <td className="py-2 px-4">{order._id}</td>
              <td className="py-2 px-4">{userName}</td>
              <td className="py-2 px-4">${order.totalPrice}</td>
              <td className="py-2 px-4">{order.orderStatus}</td>
              <td className="py-2 px-4">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 text-center flex justify-center gap-2">
                <button
                  aria-label="View order"
                  onClick={() => onView(order._id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiEye />
                </button>
                <button
                  aria-label="Edit order"
                  onClick={() => onEdit(order._id)}
                  className="text-green-500 hover:text-green-700"
                >
                  <FiEdit />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
