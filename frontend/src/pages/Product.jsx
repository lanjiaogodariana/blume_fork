import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { apiGet, getImageUrl } from "../utils/api";

// Parses a comma-separated string into a trimmed, non-empty array.
// Falls back to a sensible default if the product has no such field.
function parseList(str, fallback) {
  const list = (str || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : fallback;
}

export default function Product() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // Reset all selection state when the product ID changes
    setLoading(true);
    setProduct(null);
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
    setAdded(false);

    apiGet(`/api/products/${id}`)
      .then((data) => {
        setProduct(data);
        const sizes = parseList(data.sizes, ["XS", "S", "M", "L", "XL"]);
        const colors = parseList(data.colors, ["Standard"]);
        setSelectedSize(sizes.includes("M") ? "M" : sizes[0]);
        setSelectedColor(colors[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product && selectedSize && selectedColor) {
      addToCart(product, selectedSize, selectedColor, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center text-sm text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="serif-font text-3xl mb-4 italic">Product Not Found</h2>
        <Link
          to="/shop"
          className="text-xs tracking-widest uppercase underline"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const imageUrl = getImageUrl(product.image_url);

  const availableSizes = parseList(product.sizes, ["XS", "S", "M", "L", "XL"]);
  const availableColors = parseList(product.colors, ["Standard"]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-xs tracking-widest uppercase text-gray-400 mb-8 space-x-2">
        <Link to="/" className="hover:text-black transition">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-black transition">
          Shop
        </Link>
        <span>/</span>
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-100 aspect-[3/4] relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="serif-font text-4xl mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          <hr className="border-gray-200" />

          <p className="text-xs leading-relaxed text-gray-600 tracking-wide">
            {product.description ||
              "Designed with bespoke tailoring and lightweight linen blend fabric for a classic silhouette."}
          </p>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">
              Select Size
            </label>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 border text-xs tracking-widest flex items-center justify-center transition ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-700 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">
              Select Color
            </label>
            <div className="flex flex-wrap gap-3">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 h-10 border text-xs tracking-widest flex items-center justify-center transition ${
                    selectedColor === color
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-700 hover:border-black"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <div className="flex border border-gray-300 items-center text-xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-3 hover:bg-gray-100 transition"
              >
                -
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-3 hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
              className="flex-grow bg-black text-white py-4 text-xs tracking-widest uppercase hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {added ? "Added to Cart ✓" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
