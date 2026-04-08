import { useEffect, useState } from "react";
import { getAllApplications, updateApplicationStatus } from "../../services/adminService";
import { useNavigate } from "react-router-dom";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // Track which app is being updated

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

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateApplicationStatus(id, status);

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading applications...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">All Applications</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg">
          <thead className="bg-blue-600 text-white rounded-t-xl">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Program</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-b hover:bg-gray-50 transition">
                
                <td className="py-3 px-6">{app.fullName}</td>
                <td className="py-3 px-6">{app.email}</td>
                <td className="py-3 px-6">{app.program?.name}</td>

                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    app.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : app.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {app.status || "pending"}
                  </span>
                </td>

                <td className="py-3 px-6 flex gap-2 flex-wrap">
                  {/* VIEW */}
                  <button
                    onClick={() => navigate(`/admin/applications/${app._id}`)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md transition"
                  >
                    View
                  </button>

                  {/* ACCEPT */}
                  <button
                    onClick={() => handleStatusChange(app._id, "accepted")}
                    disabled={updatingId === app._id}
                    className={`px-3 py-1 rounded-md text-white transition ${
                      updatingId === app._id
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    Accept
                  </button>

                  {/* REJECT */}
                  <button
                    onClick={() => handleStatusChange(app._id, "rejected")}
                    disabled={updatingId === app._id}
                    className={`px-3 py-1 rounded-md text-white transition ${
                      updatingId === app._id
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Reject
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Applications;