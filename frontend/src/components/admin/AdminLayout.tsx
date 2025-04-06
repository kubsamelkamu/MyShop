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
      <aside className="hidden md:block fixed top-0 left-0 w-64 h-screen bg-blue-700 z-30">
        <Sidebar />
      </aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative z-50 w-64 bg-blue-700">
            <Sidebar />
          </div>
        </div>
      )}
      <div className="flex flex-col flex-grow md:ml-64 w-full">
        <div className="sticky top-0 z-20 bg-white shadow">
          <Header onToggleSidebar={toggleSidebar} />
        </div>
        <main className="flex-grow overflow-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
