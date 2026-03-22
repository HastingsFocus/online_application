import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
  try {
    const data = await getDashboardStats();

    setStats({
      total: data.totalApplications,   // 🔥 FIX HERE
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

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

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

// 🔥 Styles
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