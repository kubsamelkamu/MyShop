import React, { ReactNode, useState } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative z-50">
            <Sidebar />
          </div>
        </div>
      )}
      <div className="flex flex-col flex-grow">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="p-6 bg-gray-100 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
