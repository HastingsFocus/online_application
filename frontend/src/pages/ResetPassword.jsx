import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  // ================= STRENGTH BAR COLOR =================
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-sm">
            {error}
          </p>
        )}

        {message && (
          <p className="text-green-600 mb-4 text-sm">
            {message}
          </p>
        )}

        {/* NEW PASSWORD */}
        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 mb-2 rounded"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setStrength(checkPasswordStrength(e.target.value));
          }}
          required
        />

        {/* STRENGTH BAR */}
        <div className="h-2 w-full mb-2 rounded bg-gray-200">
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
        <p className="text-sm mb-4 text-gray-600">Strength: {strength || "—"}</p>

        {/* CONFIRM PASSWORD */}
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 mb-4 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;