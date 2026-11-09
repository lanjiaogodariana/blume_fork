import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <p className="serif-font text-6xl italic mb-4">404</p>
      <h1 className="serif-font text-3xl mb-4">Page Not Found</h1>
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-8">
        The page you are looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-block bg-black text-white px-8 py-4 text-xs tracking-widest uppercase hover:bg-gray-800 transition"
      >
        Return Home
      </Link>
    </div>
  );
}
