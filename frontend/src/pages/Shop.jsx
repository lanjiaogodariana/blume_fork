import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // Extract unique categories dynamically from database rows
  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [products]);

  // Filter and sort products based on search query, category, and sorting selection
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (product.category &&
          product.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });

    // Copy array before sorting to avoid mutating state directly
    return [...result].sort((a, b) => {
      if (sortBy === "price-asc") {
        return Number(a.price) - Number(b.price);
      }
      if (sortBy === "price-desc") {
        return Number(b.price) - Number(a.price);
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      return 0; // 'default' maintains original database ID ordering
    });
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Controls Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-8 mb-8 gap-6">
          <div>
            <h1 className="serif-font text-4xl italic mb-2">Product Catalog</h1>
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Showing {filteredAndSortedProducts.length} of {products.length}{" "}
              Items
            </p>
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 py-2.5 px-4 pr-8 text-xs focus:outline-none focus:border-black transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 py-2.5 px-4 text-xs uppercase tracking-widest focus:outline-none focus:border-black transition bg-white cursor-pointer"
            >
              <option value="default">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs uppercase tracking-widest transition border ${
                  selectedCategory === category
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Catalog Grid */}
        {loading ? (
          <p className="text-sm text-gray-500">
            Loading products from XAMPP MySQL...
          </p>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="serif-font text-2xl italic text-gray-400">
              No items found
            </p>
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Try adjusting your search query, sorting option, or selecting a
              different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSortBy("default");
              }}
              className="inline-block bg-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
            {filteredAndSortedProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="group cursor-pointer"
              >
                <div className="bg-gray-100 aspect-[3/4] mb-3 relative overflow-hidden">
                  <img
                    src={
                      product.image_url.startsWith("http") ||
                      product.image_url.startsWith("/")
                        ? product.image_url
                        : `/${product.image_url}`
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="flex flex-col text-xs space-y-1">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-gray-500">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
