import { useEffect, useState } from "react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className={`bg-gradient-to-r from-blue-800 to-indigo-900 text-gray-300 py-6 transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center">
        <div className="mb-2 md:mb-0">
          <p
            className="text-sm group relative transition-colors duration-300 hover:text-white cursor-pointer"
            title="© MyShop"
          >
            &copy; {new Date().getFullYear()}{" "}
            <span className="inline-block transition-transform duration-300 group-hover:scale-105 group-hover:text-blue-400">
              MyShop
            </span>. All rights reserved.

          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
