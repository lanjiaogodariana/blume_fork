import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Product() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedSize, quantity);
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

  const imageUrl =
    product.image_url.startsWith("http") || product.image_url.startsWith("/")
      ? product.image_url
      : `/${product.image_url}`;

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
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
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
            <div className="flex space-x-3">
              {["XS", "S", "M", "L", "XL"].map((size) => (
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
              className="flex-grow bg-black text-white py-4 text-xs tracking-widest uppercase hover:bg-gray-800 transition"
            >
              {added ? "Added to Cart ✓" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
