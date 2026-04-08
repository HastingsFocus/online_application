import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/adminService";
import { FaBars, FaCalendarAlt, FaSignOutAlt, FaUsers, FaCheck, FaTimes, FaClock } from "react-icons/fa";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats({
        total: data.totalApplications,
        accepted: data.accepted,
        rejected: data.rejected,
        pending: data.pending,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaBars className="text-2xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
          <h1 className="text-2xl font-bold text-gray-700">Admin Dashboard</h1>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* SIDE MENU */}
      {menuOpen && (
        <div className="absolute top-16 left-6 bg-white shadow-lg rounded-xl p-4 w-64 z-50">
          <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
            <FaCalendarAlt /> 
            <a href="/admin/set-deadline" className="text-gray-700 font-medium">Set Application Dates</a>
          </div>
          <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer" onClick={handleLogout}>
            <FaSignOutAlt /> 
            <span className="text-gray-700 font-medium">Logout</span>
          </div>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-blue-600 text-white rounded-2xl shadow p-6 flex flex-col items-center transition transform hover:scale-105">
          <FaUsers className="text-3xl mb-2" />
          <h3 className="text-lg font-semibold">Total Applications</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-green-600 text-white rounded-2xl shadow p-6 flex flex-col items-center transition transform hover:scale-105">
          <FaCheck className="text-3xl mb-2" />
          <h3 className="text-lg font-semibold">Accepted</h3>
          <p className="text-3xl font-bold">{stats.accepted}</p>
        </div>

        <div className="bg-red-600 text-white rounded-2xl shadow p-6 flex flex-col items-center transition transform hover:scale-105">
          <FaTimes className="text-3xl mb-2" />
          <h3 className="text-lg font-semibold">Rejected</h3>
          <p className="text-3xl font-bold">{stats.rejected}</p>
        </div>

        <div className="bg-yellow-400 text-black rounded-2xl shadow p-6 flex flex-col items-center transition transform hover:scale-105">
          <FaClock className="text-3xl mb-2" />
          <h3 className="text-lg font-semibold">Pending</h3>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/admin/applications" className="bg-blue-600 text-white px-5 py-3 rounded-xl shadow hover:bg-blue-700 transition">
            View Applications
          </a>
          <a href="/admin/accepted-students" className="bg-green-600 text-white px-5 py-3 rounded-xl shadow hover:bg-green-700 transition">
            Accepted Students
          </a>
          <a href="/admin/rejected-students" className="bg-red-600 text-white px-5 py-3 rounded-xl shadow hover:bg-red-700 transition">
            Rejected Students
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;