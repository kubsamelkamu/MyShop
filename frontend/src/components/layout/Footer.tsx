import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-400 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between">

          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-3">About Us</h3>
            <p className="text-sm">
              E-Commerce is your go-to platform for online shopping. We provide a wide range of products with fast shipping and customer support.
            </p>
          </div>

          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-3">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/terms" className="hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-600">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-3">Contact Us</h3>
            <div className="flex space-x-4 text-lg">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-sm">
          <p>© {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
