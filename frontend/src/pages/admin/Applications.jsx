import { useEffect, useState } from "react";
import { getAllApplications, updateApplicationStatus } from "../../services/adminService";
import { useNavigate } from "react-router-dom";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getAllApplications();
      setApplications(data.applications || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ACCEPT / REJECT
  const handleStatusChange = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);

      // 🔥 Update UI instantly
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Applications</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#007bff", color: "white" }}>
            <th>Name</th>
            <th>Email</th>
            <th>Program</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((app) => (
            <tr key={app._id} style={{ borderBottom: "1px solid #ddd" }}>
              
              <td>{app.fullName}</td>
              <td>{app.email}</td>
              <td>{app.program?.name}</td>
              <td>
                <span style={{
                  color:
                    app.status === "accepted"
                      ? "green"
                      : app.status === "rejected"
                      ? "red"
                      : "orange"
                }}>
                  {app.status || "pending"}
                </span>
              </td>

              <td>
                {/* 👁️ VIEW */}
                <button onClick={() => navigate(`/admin/applications/${app._id}`)}>
                  View
                </button>

                {/* ✅ ACCEPT */}
                <button
                  onClick={() => handleStatusChange(app._id, "accepted")}
                  style={{ marginLeft: "10px", background: "green", color: "white" }}
                >
                  Accept
                </button>

                {/* ❌ REJECT */}
                <button
                  onClick={() => handleStatusChange(app._id, "rejected")}
                  style={{ marginLeft: "10px", background: "red", color: "white" }}
                >
                  Reject
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Applications;