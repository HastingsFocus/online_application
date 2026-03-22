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
  const [loading, setLoading] = useState(false);

  // ================= PASSWORD STRENGTH CHECK =================
  const checkPasswordStrength = (password) => {
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);

    if (password.length < 6) setStrength("Weak");
    else if (hasLetters && hasNumbers && !hasSymbols) setStrength("Medium");
    else if (hasLetters && hasNumbers && hasSymbols) setStrength("Strong");
    else setStrength("Weak");
  };

  // ================= HANDLE PASSWORD INPUT =================
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };

  // ================= HANDLE REGISTER =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= STRENGTH BAR COLOR =================
  const getStrengthColor = () => {
    if (strength === "Weak") return "bg-red-500";
    if (strength === "Medium") return "bg-yellow-500";
    if (strength === "Strong") return "bg-green-500";
    return "bg-gray-300";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-3 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-2 rounded"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        {/* PASSWORD STRENGTH BAR */}
        <div className="w-full h-2 bg-gray-200 rounded mb-1">
          <div
            className={`h-2 rounded ${getStrengthColor()}`}
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

        <p className="text-sm mb-3">
          Password Strength: <b>{strength}</b>
        </p>

        {/* CONFIRM PASSWORD */}
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 mb-4 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* REGISTER BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="ml-1 text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;