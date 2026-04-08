import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ NEW
  const [loading, setLoading] = useState(false);

  const checkPasswordStrength = (password) => {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);

    if (password.length < 6) setStrength("Weak");
    else if (hasLetters && hasNumbers && !hasSymbols) setStrength("Medium");
    else if (hasLetters && hasNumbers && hasSymbols) setStrength("Strong");
    else setStrength("Weak");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // reset

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (strength !== "Strong") {
      setError("Password must contain letters, numbers, and symbols");
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);

      // ✅ SET SUCCESS MESSAGE
      setSuccess("You have been successfully registered. Redirecting to login...");

      // ✅ REDIRECT AFTER 2 SECONDS
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (strength === "Weak") return "bg-red-500";
    if (strength === "Medium") return "bg-yellow-500";
    if (strength === "Strong") return "bg-green-500";
    return "bg-gray-300";
  };

  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-50">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
    >
      {/* TITLE */}
      <h2 className="text-3xl font-bold text-center text-darkText mb-2">
        Create Account 🚀
      </h2>
      <p className="text-center text-gray-500 mb-6 text-sm">
        Start your application journey today
      </p>

      {/* ERROR */}
      {error && (
        <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
          {error}
        </p>
      )}

      {/* SUCCESS */}
      {success && (
        <p className="bg-green-100 text-green-600 p-2 rounded mb-4 text-sm">
          {success}
        </p>
      )}

      {/* USERNAME */}
      <div className="mb-3">
        <label className="block text-sm mb-1 text-gray-600">Username</label>
        <input
          type="text"
          placeholder="Enter username"
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {/* EMAIL */}
      <div className="mb-3">
        <label className="block text-sm mb-1 text-gray-600">Email</label>
        <input
          type="email"
          placeholder="Enter email"
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* PASSWORD */}
      <div className="mb-2">
        <label className="block text-sm mb-1 text-gray-600">Password</label>
        <input
          type="password"
          placeholder="Create password"
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </div>

      {/* STRENGTH BAR */}
      <div className="w-full h-2 bg-gray-200 rounded mb-1 overflow-hidden">
        <div
          className={`h-2 rounded transition-all duration-300 ${getStrengthColor()}`}
          style={{
            width:
              strength === "Weak"
                ? "33%"
                : strength === "Medium"
                ? "66%"
                : strength === "Strong"
                ? "100%"
                : "0%",
          }}
        />
      </div>

      <p className="text-xs mb-3 text-gray-600">
        Password Strength:{" "}
        <span
          className={`font-semibold ${
            strength === "Weak"
              ? "text-red-500"
              : strength === "Medium"
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {strength}
        </span>
      </p>

      {/* CONFIRM PASSWORD */}
      <div className="mb-4">
        <label className="block text-sm mb-1 text-gray-600">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        className="w-full bg-primary text-white p-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Register"}
      </button>

      {/* LOGIN LINK */}
      <p className="text-center mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-accent font-semibold hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  </div>
);
}

export default Register;