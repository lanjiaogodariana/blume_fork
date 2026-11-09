import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onOpenCart }) {
  const { cartCount } = useCart();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      {/* Top Announcement Bar */}
      <div className="bg-[#1C1C1C] text-white text-[10px] tracking-[0.2em] uppercase py-2 text-center font-light">
        Complimentary Worldwide Shipping on Orders Over $200
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Left Navigation Links */}
        <nav className="flex items-center space-x-8 text-xs tracking-[0.15em] uppercase font-light">
          <Link to="/" className="hover:text-gray-500 transition duration-200">
            Home
          </Link>
          <Link
            to="/shop"
            className="hover:text-gray-500 transition duration-200"
          >
            Catalog
          </Link>
        </nav>

        {/* Centered Brand Logo */}
        <Link
          to="/"
          className="serif-font text-3xl md:text-4xl tracking-normal lowercase text-gray-900 font-normal hover:opacity-80 transition"
        >
          blume
        </Link>

        {/* Right Actions & Auth Status */}
        <div className="flex items-center space-x-6 text-xs tracking-[0.15em] uppercase font-light">
          {user ? (
            <Link
              to="/login"
              className="hover:text-gray-500 transition duration-200 font-medium"
            >
              HI, {user.name}
            </Link>
          ) : (
            <Link
              to="/login"
              className="hover:text-gray-500 transition duration-200"
            >
              Login
            </Link>
          )}

          <button
            onClick={onOpenCart}
            className="hover:text-gray-500 transition duration-200 focus:outline-none flex items-center space-x-1"
          >
            <span>Cart</span>
            <span className="text-[10px] text-gray-400">({cartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
