import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX, FiShoppingCart, FiHome, FiBox, FiHeart, FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const NavIcon = ({ href, icon: Icon, label, count = 0 }: { href: string; icon: any; label: string; count?: number }) => (
  <Link href={href} className="relative group p-2 rounded-full hover:bg-white/10 transition-all duration-300">
    <Icon className="text-white w-6 h-6 group-hover:scale-110 group-hover:text-blue-300 transition-all duration-300" />
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
        {count}
      </span>
    )}
    <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
      {label}
    </span>
  </Link>
);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const wishlistItemsCount = useSelector((state: RootState) => state.wishlist.items.length);
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="bg-gradient-to-r from-blue-800 to-indigo-900 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-200 transition-colors duration-300">
            MyShop
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <NavIcon href="/" icon={FiHome} label="Home" />
            <NavIcon href="/products" icon={FiBox} label="Products" />
            <div className="flex items-center space-x-6 ml-4">
              <NavIcon href="/cart" icon={FiShoppingCart} label="Cart" />
              <NavIcon href="/wishlist" icon={FiHeart} label="Wishlist" count={wishlistItemsCount} />
              {user ? (
                <Link
                  href="/account"
                  className="flex items-center space-x-2 text-white hover:text-blue-200 p-2 rounded-full hover:bg-white/10 transition-all duration-300"
                >
                  <FiUser className="h-6 w-6" />
                  <span className="hidden lg:inline-block text-sm">{user.name}</span>
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white hover:text-blue-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX className="h-8 w-8" /> : <FiMenu className="h-8 w-8" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4">
            <Link href="/" onClick={() => setMenuOpen(false)} className=" text-white hover:text-blue-200 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center gap-2">
              <FiHome className="h-6 w-6" /> Home
            </Link>
            <Link href="/products" onClick={() => setMenuOpen(false)} className=" text-white hover:text-blue-200 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center gap-2">
              <FiBox className="h-6 w-6" /> Products
            </Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)} className=" text-white hover:text-blue-200 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center gap-2">
              <FiShoppingCart className="h-6 w-6" /> Cart
            </Link>
            <Link href="/wishlist" onClick={() => setMenuOpen(false)} className=" text-white hover:text-blue-200 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center gap-2">
              <FiHeart className="h-6 w-6" /> Wishlist
              {wishlistItemsCount > 0 && (
                <span className="ml-2 bg-red-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link href="/account" onClick={() => setMenuOpen(false)} className=" text-white hover:text-blue-200 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center gap-2">
                <FiUser className="h-6 w-6" /> {user.name}
              </Link>
            ) : (
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block text-center text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-sm font-medium transition-colors duration-300">
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
