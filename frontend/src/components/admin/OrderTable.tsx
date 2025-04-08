import React from "react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

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
  onDelete: (orderId: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onView, onEdit, onDelete }) => {
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
          {orders && orders.map((order) => {
            const userName =
              typeof order.user === "object" ? order.user.name : order.user;
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
                  <button onClick={() => onView(order._id)} className=" text-blue-500 hover:text-blue-700">
                    <FiEye />
                  </button>
                  <button onClick={() => onEdit(order._id)} className="text-green-500 hover:text-green-700">
                    <FiEdit />
                  </button>
                  <button onClick={() => onDelete(order._id)} className="text-red-500 hover:text-red-700">
                    <FiTrash2 />
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
