import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import API from "../services/api";

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // ================= LOGIN =================
  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // 🔥 SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // Optional: save user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update state
      setUser(res.data.user);
      setToken(res.data.token);

      return res.data;

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error.response?.data?.message || "Login failed";
    }
  };

  // ================= REGISTER =================
  const register = async (username, email, password) => {
    try {
      const res = await API.post("/auth/register", {
        username,
        email,
        password
      });

      return res.data;

    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      throw err.response?.data?.message || "Registration failed";
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // ================= LOAD USER =================
  useEffect(() => {

    const loadUser = async () => {

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/profile");

        setUser(res.data.user);

      } catch (err) {
        console.error("Token invalid, logging out");
        logout();
      }

      setLoading(false);
    };

    loadUser();

  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};