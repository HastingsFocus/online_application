import { useEffect, useState } from "react";
import { getAcceptedStudents } from "../../services/adminService";
import axios from "axios";

function AcceptedStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch data with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAccepted(search);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchAccepted = async (searchTerm = "") => {
    setLoading(true);
    try {
      const data = await getAcceptedStudents(searchTerm);
      setStudents(data.applications || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/accepted-students/pdf",
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
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

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading accepted students...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Accepted Students</h1>

      {/* SEARCH & DOWNLOAD */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-md border border-gray-300 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Download PDF
        </button>
      </div>

      {/* STUDENTS TABLE */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">#</th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">Program</th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">Email</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {students.length > 0 ? (
              students.map((app, index) => (
                <tr
                  key={app._id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{app.student?.username}</td>
                  <td className="px-6 py-3">{app.program?.name}</td>
                  <td className="px-6 py-3">{app.student?.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AcceptedStudents;