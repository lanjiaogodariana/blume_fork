import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const id = Number(orderId);
  const valid = Number.isInteger(id) && id > 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <span className="text-4xl block mb-4">✓</span>
      <h1 className="serif-font text-4xl mb-4 italic">
        Thank You for Your Order
      </h1>

      {valid ? (
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">
          Order Reference #{id}
        </p>
      ) : (
        <p className="text-xs uppercase tracking-widest text-red-500 mb-6">
          Invalid order reference
        </p>
      )}

      <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        We have received your order. Please keep your order reference number in
        case you need to contact us about it.
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
