// App.jsx / ProductList.jsx
// reusable UI elements - e.g. making a single <ProductCard /> component instead of copy-pasting the same div for every piece of clothing.
// using useState + useEffect to replace standard html - fetches the fashion catalog and updates the page without needing a hard refresh.
// fetching from backend - using fetch() inside useEffect to grab the latest products when the app loads.
// simple regex form validation - checking if the email actually looks right before sending it to the server so we don't waste requests.

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Global Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import AdminOrders from "./pages/AdminOrders";
import Login from "./pages/Login";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900 flex flex-col relative">
        <Navbar onOpenCart={() => setIsCartOpen(true)} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
