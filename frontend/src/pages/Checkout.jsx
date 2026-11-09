import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { apiPost, getImageUrl } from "../utils/api";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    phone: "",
    shipping_address: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateField = (name, value) => {
    let error = "";
    if (name === "user_name") {
      if (!value.trim()) error = "Full name is required.";
      else if (value.trim().length < 2)
        error = "Name must be at least 2 characters.";
    }
    if (name === "user_email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = "Email address is required.";
      else if (!emailRegex.test(value.trim()))
        error = "Please enter a valid email address.";
    }
    if (name === "phone") {
      const phoneRegex = /^[0-9+\s\-()]*$/;
      if (value && !phoneRegex.test(value))
        error = "Please enter a valid phone number.";
    }
    if (name === "shipping_address") {
      if (!value.trim()) error = "Shipping address is required.";
      else if (value.trim().length < 10)
        error =
          "Please provide a full delivery address (at least 10 characters).";
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear or update field error dynamically on user typing
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) return;
    if (!validateForm()) return;

    setSubmitting(true);
    setApiError("");

    const orderPayload = {
      user_name: formData.user_name.trim(),
      user_email: formData.user_email.trim(),
      phone: formData.phone.trim(),
      shipping_address: formData.shipping_address.trim(),
      // total_amount omitted — server computes from DB prices
      items: cart.map((item) => ({
        id: item.id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        // price omitted — server computes from DB
      })),
    };

    try {
      const data = await apiPost("/api/orders", orderPayload);
      clearCart();
      setSubmitting(false);
      navigate(`/order-success/${data.orderId}`);
    } catch (err) {
      console.error("Checkout error:", err);
      setApiError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };
  {
    /*
  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <span className="text-4xl block mb-4">✓</span>
        <h1 className="serif-font text-4xl mb-4 italic">
          Thank You for Your Order
        </h1>
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">
          Order Reference #{orderSuccess}
        </p>
        <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          We have received your order details and logged it into the system. A
          confirmation copy will be sent to{" "}
          <span className="font-semibold text-black">
            {formData.user_email}
          </span>
          .
        </p>
        <Link
          to="/shop"
          className="inline-block bg-black text-white px-8 py-4 text-xs tracking-widest uppercase hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }
*/
  }
  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="serif-font text-3xl mb-4 italic">Your Cart is Empty</h1>
        <p className="text-xs tracking-widest text-gray-500 mb-8 uppercase">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-black text-white px-8 py-4 text-xs tracking-widest uppercase hover:bg-gray-800 transition"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="serif-font text-4xl mb-8 italic">Checkout</h1>

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs uppercase tracking-wider">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-7 space-y-6"
        >
          <h2 className="text-xs uppercase tracking-widest font-semibold text-gray-900 border-b pb-3">
            Shipping Information
          </h2>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className={`w-full border p-3 text-xs focus:outline-none transition ${
                errors.user_name
                  ? "border-red-500 bg-red-50/20"
                  : "border-gray-300 focus:border-black"
              }`}
              placeholder="e.g. Jane Doe"
            />
            {errors.user_name && (
              <p className="text-[10px] text-red-500 uppercase tracking-widest mt-1">
                {errors.user_name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                className={`w-full border p-3 text-xs focus:outline-none transition ${
                  errors.user_email
                    ? "border-red-500 bg-red-50/20"
                    : "border-gray-300 focus:border-black"
                }`}
                placeholder="jane@example.com"
              />
              {errors.user_email && (
                <p className="text-[10px] text-red-500 uppercase tracking-widest mt-1">
                  {errors.user_email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full border p-3 text-xs focus:outline-none transition ${
                  errors.phone
                    ? "border-red-500 bg-red-50/20"
                    : "border-gray-300 focus:border-black"
                }`}
                placeholder="+1 555-0199"
              />
              {errors.phone && (
                <p className="text-[10px] text-red-500 uppercase tracking-widest mt-1">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Shipping Address *
            </label>
            <textarea
              name="shipping_address"
              rows="3"
              value={formData.shipping_address}
              onChange={handleChange}
              className={`w-full border p-3 text-xs focus:outline-none resize-none transition ${
                errors.shipping_address
                  ? "border-red-500 bg-red-50/20"
                  : "border-gray-300 focus:border-black"
              }`}
              placeholder="Street Address, Suite / Apt, City, Postal Code"
            ></textarea>
            {errors.shipping_address && (
              <p className="text-[10px] text-red-500 uppercase tracking-widest mt-1">
                {errors.shipping_address}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full bg-black text-white py-4 text-xs tracking-widest uppercase transition ${
              submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            {submitting
              ? "Processing Order..."
              : `Place Order • $${cartTotal.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-5 bg-gray-50 p-6 h-fit border border-gray-100">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-gray-900 border-b pb-3 mb-4">
            Order Summary ({cart.length})
          </h2>

          <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
            {cart.map((item) => {
              const imageUrl = getImageUrl(item.image_url);

              return (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex space-x-4 items-center"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-14 h-18 object-cover bg-gray-200"
                    />
                  ) : (
                    <div className="w-14 h-18 bg-gray-200" />
                  )}
                  <div className="flex-grow text-xs space-y-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">
                      Size: {item.size} | Color: {item.color} | Qty:{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-semibold">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 space-y-2 text-xs uppercase tracking-widest">
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>Complimentary</span>
            </div>
            <div className="flex justify-between font-semibold text-sm pt-2 border-t text-gray-900">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
