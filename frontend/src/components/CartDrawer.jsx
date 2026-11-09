import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, cartTotal } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity z-50 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 right-0 w-full md:w-[400px] h-full bg-white z-50 shadow-xl transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="serif-font text-2xl italic">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-3xl hover:text-gray-500 leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-gray-400">
              <p className="text-sm">Your cart is currently empty.</p>
            </div>
          ) : (
            cart.map((item) => {
              const imageUrl =
                item.image_url.startsWith("http") ||
                item.image_url.startsWith("/")
                  ? item.image_url
                  : `/${item.image_url}`;

              return (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex space-x-4 border-b pb-4 items-center"
                >
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-16 h-20 object-cover bg-gray-100"
                  />
                  <div className="flex-grow text-xs space-y-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                    <p className="font-semibold">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-gray-400 hover:text-red-500 text-sm px-2"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between mb-6 text-sm tracking-widest uppercase">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            onClick={onClose}
            className={`block text-center w-full bg-black text-white py-4 text-xs tracking-widest uppercase transition ${
              cart.length === 0
                ? "opacity-50 pointer-events-none"
                : "hover:bg-gray-800"
            }`}
          >
            Checkout
          </Link>
        </div>
      </div>
    </>
  );
}
