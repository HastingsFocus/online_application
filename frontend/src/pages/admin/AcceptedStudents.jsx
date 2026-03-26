import { useEffect, useState } from "react";
import { getAcceptedStudents } from "../../services/adminService";
import axios from "axios";

function AcceptedStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch data whenever search changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAccepted(search);
    }, 500); // 🔥 debounce (prevents too many requests)

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Fetch function
  const fetchAccepted = async (searchTerm = "") => {
    try {
      const data = await getAcceptedStudents(searchTerm);
      setStudents(data.applications || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Download PDF
  const downloadPDF = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/admin/accepted-students/pdf",
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "accepted_students.pdf");

    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    console.error("Download error:", error);
  }
};

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Accepted Students
      </h1>

      {/* 🔥 SEARCH INPUT (LIVE SEARCH) */}
      <input
        type="text"
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "300px",
        }}
      />

      {/* 🔥 DOWNLOAD BUTTON */}
      <button
        onClick={downloadPDF}
        className="bg-blue-600 text-white px-6 py-3 rounded mb-6 ml-4"
      >
        Download Accepted Students PDF
      </button>

      {/* 🔥 TABLE */}
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Program</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {students.length > 0 ? (
            students.map((app, index) => (
              <tr key={app._id}>
                <td>{index + 1}</td>
                <td>{app.student?.username}</td>
                <td>{app.program?.name}</td>
                <td>{app.student?.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AcceptedStudents;