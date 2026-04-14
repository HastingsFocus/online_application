import { useEffect, useState } from "react";
import API from "../../services/api";

function SetDeadline() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ================= LOAD EXISTING SETTINGS =================
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/settings");
        if (res.data) {
          setStart(res.data.applicationStart?.slice(0, 16) || "");
          setEnd(res.data.applicationEnd?.slice(0, 16) || "");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchSettings();
  }, []);

  // ================= HANDLE SAVE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const now = new Date();
    const s = new Date(start);
    const eDate = new Date(end);

    if (s < now) {
      setMessage("❌ Start date cannot be in the past");
      return;
    }

    if (eDate <= s) {
      setMessage("❌ End date must be after start date");
      return;
    }

    setLoading(true);
    try {
      await API.post("/settings", {
  applicationStart: new Date(start).toISOString(),
  applicationEnd: new Date(end).toISOString(),
});
      setMessage("✅ Deadline updated successfully!");
    } catch (error) {
      console.error("Save error:", error);
      setMessage("❌ Failed to update deadline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg relative overflow-hidden">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
          Set Application Deadline
        </h2>

        {/* Decorative Shapes */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-100 rounded-full opacity-30 animate-pulse"></div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          {/* START DATE */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 font-medium">Start Date & Time</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* END DATE */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 font-medium">End Date & Time</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 py-3 rounded-xl text-white font-semibold transition transform hover:scale-105 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            }`}
          >
            {loading ? "Saving..." : "Save Deadline"}
          </button>

          {/* MESSAGE */}
          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default SetDeadline;