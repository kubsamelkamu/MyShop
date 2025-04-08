import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import OrderTable from "@/components/admin/OrderTable";
import Modal from "@/components/admin/Modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAllOrders, updateOrderStatus } from "@/store/slices/orderSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const Orders = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);

  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const userName = typeof order.user === "object" ? (order.user as { name: string }).name : order.user;
      const searchLower = searchTerm.toLowerCase();
      return (
        order._id.toLowerCase().includes(searchLower) ||
        (userName && userName.toLowerCase().includes(searchLower)) ||
        order.orderStatus.toLowerCase().includes(searchLower)
      );
    });
  }, [orders, searchTerm]);

  const handleView = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  const handleEdit = (orderId: string) => {
    console.log("Editing order:", orderId);
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = () => {

    if (selectedOrderId && newStatus) {
      dispatch(updateOrderStatus({ orderId: selectedOrderId, orderStatus: newStatus }))
        .unwrap()
        .then((updatedOrder) => {
          console.log("Update successful, updated order:", updatedOrder);
          toast.success("Order status updated successfully!");
          setIsModalOpen(false);
          dispatch(fetchAllOrders());
        })
        .catch((err) => {
          console.error("Update failed:", err);
          toast.error("Failed to update order status: " + err);
        });
    } else {
      toast.error("Please select a status");
    }
  };
  

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Order Management</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Order ID, Status, or User Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {loading && <p>Loading orders...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <OrderTable
          orders={filteredOrders}
          onView={handleView}
          onEdit={handleEdit}
        />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Update Order Status</h2>
            <select
              value={newStatus}
              title="Select status"
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select status</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default Orders;
