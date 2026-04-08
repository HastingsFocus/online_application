import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState("");

  // ================= PASSWORD STRENGTH CHECK =================
  const checkPasswordStrength = (password) => {
    const hasLetters = /[A-Za-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasLetters && hasNumbers && hasSymbols) return "Strong";
    if ((hasLetters && hasNumbers) || (hasLetters && hasSymbols) || (hasNumbers && hasSymbols)) return "Medium";
    return "Weak";
  };

  const getStrengthColor = () => {
    if (strength === "Weak") return "bg-red-500";
    if (strength === "Medium") return "bg-yellow-500";
    if (strength === "Strong") return "bg-green-500";
    return "bg-gray-300";
  };

  // ================= HANDLE RESET PASSWORD =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

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
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col"
      >
        <h2 className="text-3xl font-bold text-center text-darkText mb-2">
          Reset Your Password 🔑
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Enter your new password below to reset your account.
        </p>

        {/* ERROR */}
        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        {/* SUCCESS MESSAGE */}
        {message && (
          <p className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm text-center">
            {message}
          </p>
        )}

        {/* NEW PASSWORD */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setStrength(checkPasswordStrength(e.target.value));
            }}
            required
          />
          {/* STRENGTH BAR */}
          <div className="h-2 w-full mt-2 rounded bg-gray-200">
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
          <p className="text-sm mt-1 text-gray-600">Strength: {strength || "—"}</p>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white p-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {/* LINKS */}
        <div className="text-center mt-4 text-sm">
          <Link to="/login" className="text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;