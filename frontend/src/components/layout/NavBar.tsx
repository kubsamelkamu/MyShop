import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiHeart,
  FiBox,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import Image from "next/image";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-400 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:opacity-80 transition flex items-center gap-2"
        >
          🛍 E-Commerce
        </Link>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-2xl text-blue-600">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm md:text-base">
          <Link href="/products" className="flex items-center gap-1 hover:text-blue-600 transition">
            <FiBox /> Products
          </Link>
          <Link href="/cart" className="flex items-center gap-1 hover:text-blue-600 transition">
            <FiShoppingCart /> Cart
          </Link>
          <Link href="/wishlist" className="flex items-center gap-1 hover:text-blue-600 transition">
            <FiHeart /> Wishlist
          </Link>

          {user ? (
            <div className="relative">
              <button
                className="flex items-center gap-2"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Image
                  src="/avatar.jpg"
                  alt="User Avatar"
                  width={32}
                  height={32}
                  unoptimized
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-600"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md overflow-hidden z-50 w-48">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    Hello, {user.name}
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiUser /> My Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiBox /> Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login">
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition flex items-center gap-1">
                <FiUser /> Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4 text-sm">
          <Link href="/products" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-blue-600">
            <FiBox /> Products
          </Link>
          <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-blue-600">
            <FiShoppingCart /> Cart
          </Link>
          <Link href="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-blue-600">
            <FiHeart /> Wishlist
          </Link>

          {user ? (
            <>
              <div className="flex items-center gap-2">
                <Image
                  src="/avatar.jpg"
                  alt="User Avatar"
                  width={32}
                  height={32}
                  unoptimized
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-600"
                />
                <span className="text-gray-700">{user.name}</span>
              </div>

              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <FiUser /> My Profile
              </Link>
              <Link
                href="/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <FiBox /> Orders
              </Link>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-1"
              >
                <FiUser /> Login
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
