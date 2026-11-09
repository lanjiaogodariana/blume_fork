import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("blume_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("blume_cart", JSON.stringify(cart));
  }, [cart]);

  // Match on id + size + color so each variant is a separate line item.
  const addToCart = (product, size, color, quantity = 1) => {
    const safeSize = size || "Standard";
    const safeColor = color || "Standard";
    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.size === safeSize &&
          item.color === safeColor,
      );
      if (existingIndex > -1) {
        // Immutable update — new array, new object at the matched index
        return prev.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item,
        );
      }
      return [
        ...prev,
        {
          ...product,
          size: safeSize,
          color: safeColor,
          quantity: safeQuantity,
        },
      ];
    });
  };

  const removeFromCart = (id, size, color) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color),
      ),
    );
  };

  // delta: +1 to increment, -1 to decrement.
  // If quantity would drop to 0 or below, the item is removed entirely
  // (matches the base version's "decrease → remove at 0" behaviour).
  const updateQuantity = (id, size, color, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
