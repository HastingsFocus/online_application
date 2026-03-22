import { useState } from "react";
import axios from "axios";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setMessage(res.data.message);

    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-96"
      >

        <h2 className="text-xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Send Reset Link
        </button>

        {message && (
          <p className="mt-3 text-center text-sm">{message}</p>
        )}

      </form>

    </div>
  );
}

export default ForgotPassword;