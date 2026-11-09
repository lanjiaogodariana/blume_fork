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
import OrderSuccess from "./pages/OrderSuccess";
import AdminOrders from "./pages/AdminOrders";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

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
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
