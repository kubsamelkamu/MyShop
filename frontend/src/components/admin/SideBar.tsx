import Link from "next/link";
import { FiHome, FiBox, FiShoppingCart, FiUsers } from "react-icons/fi";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen overflow-y-auto bg-blue-700 text-white p-4 flex-shrink-0">
      <div className="text-2xl font-bold mb-10">Admin Panel</div>
      <nav className="flex flex-col space-y-10">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-4 hover:text-gray-300"
        >
          <FiHome /> Dashboard
        </Link>
        <Link
          href="/admin/products"
          className="flex items-center gap-4 hover:text-gray-300"
        >
          <FiBox /> Products
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-4 hover:text-gray-300"
        >
          <FiShoppingCart /> Orders
        </Link>
        <Link
          href="/admin/users"
          className="flex items-center gap-4 hover:text-gray-300"
        >
          <FiUsers /> Users
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
