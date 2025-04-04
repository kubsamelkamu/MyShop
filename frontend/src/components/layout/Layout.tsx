import React, { ReactNode } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
