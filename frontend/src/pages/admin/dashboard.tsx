import React, { useEffect, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardCards from "@/components/admin/DashboardCards";
import SalesChart, { ChartData } from "@/components/admin/SalesChart";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchProducts } from "@/store/slices/productSlice";
import { fetchAllOrders } from "@/store/slices/orderSlice";
import { fetchUsers } from "@/store/slices/userSlice"; 
import { getMonthlySales } from "@/utils/selectors";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const products = useSelector((state: RootState) => state.products.products);
  const orders = useSelector((state: RootState) => state.orders.orders);
  const users = useSelector((state: RootState) => state.users.users);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchAllOrders());
    dispatch(fetchUsers());
  }, [dispatch]);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.orderStatus === "Pending").length;
  const totalUsers = users ? users.length : 0;
  const totalSales = orders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((acc, order) => acc + order.totalPrice, 0);

  const chartData: ChartData[] = useMemo(() => {
    return getMonthlySales(orders);
  }, [orders]);

  return (
    <AdminLayout>
      <div className="p-4">
        <DashboardCards
          totalProducts={totalProducts}
          totalOrders={totalOrders}
          pendingOrders={pendingOrders}
          totalUsers={totalUsers}
          totalSales={totalSales}
        />
        <div className="mt-6">
          <SalesChart data={chartData} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
