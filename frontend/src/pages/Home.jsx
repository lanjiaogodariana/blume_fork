import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiGet, getImageUrl } from "../utils/api";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/api/products")
      .then((data) => {
        // Server returns products ordered by id DESC — newest first.
        setFeatured(data.slice(0, 4));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching featured products:", err);
        setError("Unable to load new arrivals.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Taller Hero Video Banner with lower positioned text */}
      <section className="relative w-full h-screen bg-black overflow-hidden flex items-end justify-center pb-24">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 text-center text-white space-y-6">
          <h2 className="serif-font text-5xl md:text-7xl italic tracking-wide">
            The Fall Collection
          </h2>
          <div>
            <Link
              to="/shop"
              className="inline-block border border-white px-10 py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Just Arrived Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="flex justify-between items-end mb-10">
          <h3 className="serif-font text-4xl italic">Just Arrived</h3>
          <Link
            to="/shop"
            className="text-xs tracking-widest uppercase border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading new arrivals...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
            {featured.map((product) => {
              const imageUrl = getImageUrl(product.image_url);
              return (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="group cursor-pointer"
                >
                  <div className="bg-gray-100 aspect-[3/4] mb-3 relative overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex flex-col text-xs space-y-1 text-gray-900">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-gray-500">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
