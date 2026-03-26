import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const context = useContext(AuthContext);

  if (!context) {
    return <p>Error: AuthContext missing</p>;
  }

  const { user, logout, loading } = context;

  const [settings, setSettings] = useState(null);
  const [status, setStatus] = useState("");

  // ==============================
  // FETCH SETTINGS
  // ==============================
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/settings");
        setSettings(res.data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  // ==============================
  // TIMER
  // ==============================
  useEffect(() => {
    if (!settings) return;

    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [settings]);

  const updateStatus = () => {
    if (!settings) return;

    const now = new Date();
    const start = new Date(settings.applicationStart);
    const end = new Date(settings.applicationEnd);

    if (now < start) {
      setStatus("⏳ Applications not yet open");
      return;
    }

    if (now > end) {
      setStatus("❌ Applications closed");
      return;
    }

    const diff = end - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    setStatus(`🔥 Open - ${days}d ${hours}h ${minutes}m left`);
  };

  // ==============================
  // CHECK IF OPEN
  // ==============================
  const now = new Date();

  let isOpen = false;

  if (settings) {
    const start = new Date(settings.applicationStart);
    const end = new Date(settings.applicationEnd);

    isOpen = now >= start && now <= end;
  }

  // ==============================
  // LOADING
  // ==============================
  if (loading) return <p>Loading...</p>;

  // ==============================
  // UI
  // ============================
  return (
    <div className="p-10">
      <h1>Welcome {user?.name || "Student"}</h1>

      <p>{status}</p>

      {/* 🔥 APPLY BUTTON LOGIC */}
      {isOpen ? (
  <Link
    to={user ? "/apply" : "/login"}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Apply Now
  </Link>
) : (
  <button
    disabled
    className="bg-gray-400 text-white px-4 py-2 rounded"
  >
    Apply Closed
  </button>
)}

      {/* OTHER BUTTONS */}
      <div className="mt-4">
        {user && (
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;