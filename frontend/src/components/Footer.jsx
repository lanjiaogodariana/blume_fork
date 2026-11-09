import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#EBEAE5] text-gray-800 pt-16 pb-12 mt-auto border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-gray-300/60">
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="serif-font text-3xl lowercase">blume</h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-sm tracking-wide">
              Bespoke luxury attire designed with timeless tailoring and
              sustainable natural fabrics.
            </p>
            <form onSubmit={handleSubscribe} className="pt-2 flex max-w-sm">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/80 border border-gray-300 px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white flex-grow transition"
              />
              <button
                type="submit"
                className="bg-black text-white px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition"
              >
                {subscribed ? "Joined" : "Subscribe"}
              </button>
            </form>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-2 text-xs space-y-3">
            <h4 className="uppercase tracking-[0.2em] text-[10px] text-gray-500 font-semibold mb-4">
              Collection
            </h4>
            <p>
              <Link to="/shop" className="hover:text-black transition">
                All Apparel
              </Link>
            </p>
            <p>
              <Link to="/shop" className="hover:text-black transition">
                New Arrivals
              </Link>
            </p>
            <p>
              <Link to="/shop" className="hover:text-black transition">
                Essential Linen
              </Link>
            </p>
          </div>

          <div className="md:col-span-2 text-xs space-y-3">
            <h4 className="uppercase tracking-[0.2em] text-[10px] text-gray-500 font-semibold mb-4">
              Client Care
            </h4>
            <p className="text-gray-600 hover:text-black cursor-pointer transition">
              Shipping & Returns
            </p>
            <p className="text-gray-600 hover:text-black cursor-pointer transition">
              Garment Care
            </p>
            <p className="text-gray-600 hover:text-black cursor-pointer transition">
              Contact Us
            </p>
          </div>

          <div className="md:col-span-3 text-xs space-y-3">
            <h4 className="uppercase tracking-[0.2em] text-[10px] text-gray-500 font-semibold mb-4">
              Atelier
            </h4>
            <p className="text-gray-600 leading-relaxed">
              72 Orchard Road, #04-12
              <br />
              Singapore 238887
            </p>
            <p className="text-gray-500 text-[11px] pt-1">
              concierge@blume.com
            </p>
          </div>
        </div>

        {/* Bottom Bar & Discrete Admin Access Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] tracking-[0.2em] uppercase text-gray-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} BLUME OFFICIAL. ALL RIGHTS
            RESERVED.
          </p>

          <button
            onClick={() => navigate("/admin/orders")}
            className="hover:text-black transition cursor-pointer text-gray-400 underline decoration-gray-300"
          >
            Admin Access
          </button>
        </div>
      </div>
    </footer>
  );
}
