import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("blume_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("blume_user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("blume_user");
    }
  }, [user]);

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      // Decode Google's JWT token payload
      const decoded = jwtDecode(credentialResponse.credential);

      const googleUser = {
        name: decoded.name ? decoded.name.toUpperCase() : "USER",
        email: decoded.email,
        avatar: decoded.picture,
      };

      setUser(googleUser);
    } catch (error) {
      console.error("Failed to decode Google credential token:", error);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleGoogleSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
