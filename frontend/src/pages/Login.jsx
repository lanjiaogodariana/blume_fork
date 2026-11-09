import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const { user, handleGoogleSuccess, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white p-10 border border-gray-200 shadow-sm text-center">
        {user ? (
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-400 block">
              Account Signed In
            </span>
            <h1 className="serif-font text-3xl italic text-gray-900">
              HI, {user.name}
            </h1>
            <p className="text-xs text-gray-500">{user.email}</p>

            <div className="pt-4 space-y-3">
              <button
                onClick={() => navigate("/shop")}
                className="w-full bg-black text-white py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition"
              >
                Continue Shopping
              </button>
              <button
                onClick={logout}
                className="w-full border border-gray-300 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gray-100 transition text-gray-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 flex flex-col items-center">
            <h1 className="serif-font text-3xl italic">Client Portal</h1>
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Sign in to access your saved wardrobe & orders
            </p>

            {/* Google OAuth Login Button */}
            <div className="pt-2 flex justify-center w-full">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleGoogleSuccess(credentialResponse);
                  navigate("/");
                }}
                onError={() => {
                  console.error("Google Sign-In failed");
                }}
                shape="rectangular"
                theme="outline"
                width="300"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
