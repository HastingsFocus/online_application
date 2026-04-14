import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../services/api";

import bg1 from "../assets/images/IMG_6363-scaled.jpg";
import bg2 from "../assets/images/IMG_6369-scaled.jpg";

function Dashboard() {
  const { user, logout, loading } = useContext(AuthContext);

  const [settings, setSettings] = useState(null);
  const [status, setStatus] = useState("");
  const [timeLeft, setTimeLeft] = useState({});
  const [bgIndex, setBgIndex] = useState(0);

  const backgrounds = [bg1, bg2];

  // ==============================
  // FETCH SETTINGS
  // ==============================
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/settings");
        setSettings(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSettings();
  }, []);

  // ==============================
  // BACKGROUND SLIDER
  // ==============================
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ==============================
  // TIMER
  // ==============================
  useEffect(() => {
    if (!settings) return;

    const interval = setInterval(() => {
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

      setTimeLeft({ days, hours, minutes });
      setStatus("🔥 Applications Open");
    }, 1000);

    return () => clearInterval(interval);
  }, [settings]);

  if (loading) return <p>Loading...</p>;

  const now = new Date();
  let isOpen = false;

  if (settings) {
    const start = new Date(settings.applicationStart);
    const end = new Date(settings.applicationEnd);
    isOpen = now >= start && now <= end;
  }

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          backgroundImage: `url(${backgrounds[bgIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome, {user?.name || "Student"} 👋
        </h1>

        <p className="text-lg text-gray-200 mb-6 max-w-xl">
          Start your journey in health sciences. Apply now and take the first step toward a successful medical career.
        </p>

        {/* STATUS */}
        <p className="text-xl font-semibold mb-6">{status}</p>
{/* COUNTDOWN */}
{isOpen && (
  <div className="flex flex-col items-center mb-8">
    
    {/* TIME BOXES */}
    <div className="flex gap-4">
      <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl w-24 text-center">
        <p className="text-2xl font-bold">{timeLeft.days}</p>
        <p className="text-sm">Days</p>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl w-24 text-center">
        <p className="text-2xl font-bold">{timeLeft.hours}</p>
        <p className="text-sm">Hrs</p>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl w-24 text-center">
        <p className="text-2xl font-bold">{timeLeft.minutes}</p>
        <p className="text-sm">Minutes</p>
      </div>
    </div>

    {/* LEFT CONTAINER */}
    <div className="mt-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-xl">
      <p className="font-bold text-sm tracking-wide">LEFT</p>
    </div>

  </div>
)}

        {/* BUTTON */}
        {isOpen ? (
          <Link
            to={user ? "/apply" : "/login"}
            className="bg-primary px-6 py-3 rounded-xl font-semibold text-lg hover:scale-105 transition"
          >
            Apply Now 🚀
          </Link>
        ) : (
          <button
            disabled
            className="bg-gray-500 px-6 py-3 rounded-xl text-lg"
          >
            Applications Closed
          </button>
        )}

        {/* LOGOUT */}
        {user && (
          <button
            onClick={logout}
            className="mt-6 text-sm underline text-gray-300 hover:text-white"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;