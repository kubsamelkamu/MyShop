import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import Link from "next/link";
import Image from "next/image";
import router from "next/router";
import { FiMenu } from "react-icons/fi";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden mr-4 focus:outline-none"
          >
            <FiMenu size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold text-blue-800">Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Link href="/admin/profile" className="flex items-center gap-2">
              <Image
                src="/avatar.jpg"
                alt="Admin Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-blue-700">{user.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
