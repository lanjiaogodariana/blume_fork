import { useState, useEffect } from "react";

export default function AdminOrders() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("blume_admin_auth") === "true";
  });
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Verify Passcode Entry
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "blume2026") {
      sessionStorage.setItem("blume_admin_auth", "true");
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("blume_admin_auth");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("http://localhost:5000/api/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Admin order fetch error:", err);
        setError("Unable to load orders from backend server.");
        setLoading(false);
      });
  }, [isAuthenticated]);

  const toggleOrderDetails = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  // Render Admin Auth Modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white p-8 border border-gray-200 shadow-sm text-center">
          <h2 className="serif-font text-3xl mb-2 italic">Admin Access</h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">
            Enter your administrative key to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Passcode (Default: blume2026)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className={`w-full border p-3 text-xs focus:outline-none transition ${
                passcodeError
                  ? "border-red-500 bg-red-50/20"
                  : "border-gray-300 focus:border-black"
              }`}
            />
            {passcodeError && (
              <p className="text-[10px] text-red-500 uppercase tracking-widest">
                Invalid passcode. Try{" "}
                <span className="font-semibold">blume2026</span>
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-black text-white py-3.5 text-xs uppercase tracking-widest hover:bg-gray-800 transition"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total_amount),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-12">
      <main className="max-w-7xl mx-auto px-6">
        {/* Header & Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="serif-font text-4xl italic mb-1">Admin Dashboard</h1>
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Order Management & Logistics
            </p>
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0 text-xs uppercase tracking-widest">
            <div className="bg-white p-4 border border-gray-200 min-w-[140px] text-center">
              <span className="text-gray-400 block text-[10px] mb-1">
                Total Orders
              </span>
              <span className="text-lg font-semibold">{orders.length}</span>
            </div>
            <div className="bg-white p-4 border border-gray-200 min-w-[140px] text-center">
              <span className="text-gray-400 block text-[10px] mb-1">
                Revenue
              </span>
              <span className="text-lg font-semibold">
                ${totalRevenue.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="border border-gray-300 bg-white px-4 py-4 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition"
            >
              Lock
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 text-xs uppercase tracking-wider">
            {error}
          </div>
        )}

        {/* Orders Table */}
        {loading ? (
          <p className="text-sm text-gray-500">Loading orders from MySQL...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 text-center border border-gray-200">
            <p className="serif-font text-2xl italic text-gray-400 mb-2">
              No orders recorded
            </p>
            <p className="text-xs uppercase tracking-widest text-gray-500">
              When customers place orders at checkout, they will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 uppercase tracking-widest text-[10px] text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Items</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  const formattedDate = order.created_at
                    ? new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <tbody key={order.id} className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6 font-semibold">#{order.id}</td>
                        <td className="py-4 px-6">
                          <p className="font-medium text-gray-900">
                            {order.user_name}
                          </p>
                          <p className="text-gray-400 text-[11px]">
                            {order.user_email}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-gray-500">
                          {formattedDate}
                        </td>
                        <td className="py-4 px-6 text-gray-500">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          )}{" "}
                          unit(s)
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-900">
                          ${Number(order.total_amount).toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => toggleOrderDetails(order.id)}
                            className="border border-black px-3 py-1.5 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition"
                          >
                            {isExpanded ? "Hide Details" : "View Details"}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Detail Drawer */}
                      {isExpanded && (
                        <tr className="bg-gray-50/80">
                          <td colSpan="6" className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                              {/* Shipping Details */}
                              <div>
                                <h4 className="uppercase tracking-widest font-semibold text-[10px] text-gray-400 mb-2">
                                  Shipping Information
                                </h4>
                                <p className="font-medium">{order.user_name}</p>
                                <p className="text-gray-600 whitespace-pre-line mt-1">
                                  {order.shipping_address}
                                </p>
                                {order.phone && (
                                  <p className="text-gray-500 mt-2">
                                    Phone: {order.phone}
                                  </p>
                                )}
                              </div>

                              {/* Purchased Items List */}
                              <div>
                                <h4 className="uppercase tracking-widest font-semibold text-[10px] text-gray-400 mb-2">
                                  Order Contents
                                </h4>
                                <div className="space-y-3">
                                  {order.items.map((item, idx) => {
                                    const imageUrl = item.image_url
                                      ? item.image_url.startsWith("http") ||
                                        item.image_url.startsWith("/")
                                        ? item.image_url
                                        : `/${item.image_url}`
                                      : null;

                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-center space-x-3 border-b border-gray-200 pb-2"
                                      >
                                        {imageUrl && (
                                          <img
                                            src={imageUrl}
                                            alt={item.name}
                                            className="w-10 h-12 object-cover bg-gray-200"
                                          />
                                        )}
                                        <div className="flex-grow">
                                          <p className="font-medium text-gray-900">
                                            {item.name}
                                          </p>
                                          <p className="text-gray-400 text-[10px]">
                                            Qty: {item.quantity} × $
                                            {Number(item.price).toFixed(2)}
                                          </p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                          $
                                          {(item.quantity * item.price).toFixed(
                                            2,
                                          )}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
