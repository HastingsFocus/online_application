import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/adminService";
import { FaBars, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";

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

  // 🔥 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "20px", position: "relative" }}>

      {/* 🔥 TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <FaBars
          size={24}
          style={{ cursor: "pointer" }}
          onClick={() => setMenuOpen(!menuOpen)}
        />
        <h2 style={{ marginLeft: "15px" }}>Admin Dashboard</h2>
      </div>

      {/* 🔥 SIDE MENU */}
      {menuOpen && (
        <div style={menuStyle}>
          
          <div style={menuItemStyle}>
            <FaCalendarAlt />
            <a href="/admin/set-deadline" style={linkStyle}>
              Set Application Dates
            </a>
          </div>

          <div style={menuItemStyle} onClick={handleLogout}>
            <FaSignOutAlt />
            <span style={linkStyle}>Logout</span>
          </div>

        </div>
      )}

      {/* 🔥 STATS CARDS */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        
        <div style={cardStyle}>
          <h3>Total Applications</h3>
          <p style={numberStyle}>{stats.total}</p>
        </div>

        <div style={{ ...cardStyle, background: "#28a745" }}>
          <h3>Accepted</h3>
          <p style={numberStyle}>{stats.accepted}</p>
        </div>

        <div style={{ ...cardStyle, background: "#dc3545" }}>
          <h3>Rejected</h3>
          <p style={numberStyle}>{stats.rejected}</p>
        </div>

        <div style={{ ...cardStyle, background: "#ffc107", color: "#000" }}>
          <h3>Pending</h3>
          <p style={numberStyle}>{stats.pending}</p>
        </div>

      </div>

      {/* 🔥 QUICK ACTIONS */}
      <div style={{ marginTop: "40px" }}>
        <h3>Quick Actions</h3>

        <div style={{ display: "flex", gap: "20px" }}>
          <a href="/admin/applications" style={buttonStyle}>
            View Applications
          </a>

          <a href="/admin/accepted-students" style={buttonStyle}>
            Accepted Students
          </a>
        </div>
      </div>
    </div>
  );
}

// 🔥 MENU STYLES
const menuStyle = {
  position: "absolute",
  top: "60px",
  left: "20px",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "10px",
  width: "220px",
  zIndex: 1000,
};

const menuItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px",
  cursor: "pointer",
};

const linkStyle = {
  textDecoration: "none",
  color: "#000",
};

// 🔥 EXISTING STYLES
const cardStyle = {
  flex: "1",
  minWidth: "200px",
  padding: "20px",
  background: "#007bff",
  color: "white",
  borderRadius: "10px",
  textAlign: "center",
};

const numberStyle = {
  fontSize: "28px",
  fontWeight: "bold",
};

const buttonStyle = {
  padding: "12px 20px",
  background: "#007bff",
  color: "white",
  textDecoration: "none",
  borderRadius: "5px",
};

export default AdminDashboard;