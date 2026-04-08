import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= HANDLE LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      console.log("Login successful:", data);
      navigate("/apply");
    } catch (err) {
      setError(err || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-50">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
    >
      {/* TITLE */}
      <h2 className="text-3xl font-bold text-center text-darkText mb-2">
        Welcome Back 👋
      </h2>
      <p className="text-center text-gray-500 mb-6 text-sm">
        Login to continue your application
      </p>

      {/* ERROR */}
      {error && (
        <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
          {error}
        </p>
      )}

      {/* EMAIL */}
      <div className="mb-4">
        <label className="block text-sm mb-1 text-gray-600">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* PASSWORD */}
      <div className="mb-4 relative">
        <label className="block text-sm mb-1 text-gray-600">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-xs text-gray-500 hover:text-primary"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {/* LOGIN BUTTON */}
      <button
        type="submit"
        className="w-full bg-primary text-white p-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* LINKS */}
      <div className="text-center mt-4 text-sm">
        <Link
          to="/forgot-password"
          className="text-primary hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <p className="text-sm text-center mt-4">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-accent font-semibold hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  </div>
);
}
export default Login;