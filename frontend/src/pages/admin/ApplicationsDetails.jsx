import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplicationById, updateApplicationStatus } from "../../services/adminService";

function ApplicationDetails() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // 🔥 Track status change

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const data = await getApplicationById(id);
      setApplication(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      await updateApplicationStatus(id, status);
      setApplication((prev) => ({ ...prev, status }));
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading application...</p>;
  if (!application) return <p className="text-center mt-10">No application found</p>;

  // 🔹 Dynamic badge color
  const statusColor = () => {
    if (application.status === "accepted") return "bg-green-100 text-green-800";
    if (application.status === "rejected") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Application Details</h2>

      {/* PERSONAL INFO */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
        <p><b>Name:</b> {application.fullName}</p>
        <p><b>Email:</b> {application.email}</p>
        <p><b>Phone:</b> {application.phone}</p>
        <p><b>Gender:</b> {application.gender}</p>
        <p><b>District:</b> {application.district}</p>
        <p><b>Address:</b> {application.address}</p>
      </div>

      {/* PROGRAM */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Program</h3>
        <p>{application.program?.name}</p>
      </div>

      {/* STATUS */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Status</h3>
        <span className={`px-3 py-1 rounded-full font-semibold ${statusColor()}`}>
          {application.status || "pending"}
        </span>
      </div>

      {/* SUBJECTS */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Subjects</h3>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Subject</th>
              <th className="py-2 px-4 text-left">Grade Points</th>
            </tr>
          </thead>
          <tbody>
            {application.subjects?.map((sub, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{sub.name}</td>
                <td className="py-2 px-4">{sub.gradePoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DOCUMENTS */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Documents</h3>
        <ul className="space-y-2">
          <li>
            Passport Photo:{" "}
            <a
              href={`http://localhost:5000/uploads/${application.passportPhoto}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              View
            </a>
          </li>
          <li>
            MSCE Certificate:{" "}
            <a
              href={`http://localhost:5000/uploads/${application.msceCertificate}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              View
            </a>
          </li>
          <li>
            Bank Slip:{" "}
            <a
              href={`http://localhost:5000/uploads/${application.bankSlip}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              View
            </a>
          </li>
        </ul>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={() => handleStatusChange("accepted")}
          disabled={updating}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            application.status === "accepted"
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {application.status === "accepted" ? "Accepted" : updating ? "Updating..." : "Accept"}
        </button>

        <button
          onClick={() => handleStatusChange("rejected")}
          disabled={updating}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            application.status === "rejected"
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {application.status === "rejected" ? "Rejected" : updating ? "Updating..." : "Reject"}
        </button>
      </div>
    </div>
  );
}

export default ApplicationDetails;