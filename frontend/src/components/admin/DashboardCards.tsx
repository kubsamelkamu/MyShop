import React from "react";
import { FiBox, FiShoppingCart, FiUser, FiDollarSign } from "react-icons/fi";

interface DashboardCardsProps {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalUsers: number;
  totalSales: number; 
}

const DashboardCards = ({
  totalProducts,
  totalOrders,
  pendingOrders,
  totalUsers,
  totalSales,
}: DashboardCardsProps) => {
  const cardData = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: <FiBox />,
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <FiShoppingCart />,
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: <FiShoppingCart />,
    },
    {
      title: "Total Users",
      value: totalUsers,
      icon: <FiUser />,
    },
    {
      title: "Total Sales",
      value: `$${totalSales.toFixed(2)}`,
      icon: <FiDollarSign />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cardData.map((card, idx) => (
        <div key={idx} className="bg-white p-4 rounded shadow flex items-center gap-4">
          <div className="text-3xl text-blue-700">{card.icon}</div>
          <div>
            <p className="text-sm text-blue-700">{card.title}</p>
            <h2 className="text-xl text-blue-700 font-bold">{card.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
