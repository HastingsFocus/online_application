import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplicationById, updateApplicationStatus } from "../../services/adminService";

function ApplicationDetails() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // ✅ Accept / Reject
  const handleStatusChange = async (status) => {
    try {
      await updateApplicationStatus(id, status);
      setApplication((prev) => ({ ...prev, status }));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading application...</p>;
  if (!application) return <p>No application found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Application Details</h2>

      {/* PERSONAL INFO */}
      <h3>Personal Information</h3>
      <p><b>Name:</b> {application.fullName}</p>
      <p><b>Email:</b> {application.email}</p>
      <p><b>Phone:</b> {application.phone}</p>
      <p><b>Gender:</b> {application.gender}</p>
      <p><b>District:</b> {application.district}</p>
      <p><b>Address:</b> {application.address}</p>

      {/* PROGRAM */}
      <h3>Program</h3>
      <p>{application.program?.name}</p>

      {/* STATUS */}
      <h3>Status</h3>
      <p style={{
        color:
          application.status === "accepted"
            ? "green"
            : application.status === "rejected"
            ? "red"
            : "orange"
      }}>
        {application.status || "pending"}
      </p>

      {/* SUBJECTS */}
      <h3>Subjects</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Grade Points</th>
          </tr>
        </thead>
        <tbody>
          {application.subjects?.map((sub, index) => (
            <tr key={index}>
              <td>{sub.name}</td>
              <td>{sub.gradePoints}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FILES */}
      <h3>Documents</h3>

      <p>
        Passport Photo:{" "}
        <a
          href={`http://localhost:5000/uploads/${application.passportPhoto}`}
          target="_blank"
          rel="noreferrer"
        >
          View Passport
        </a>
      </p>

      <p>
        MSCE Certificate:{" "}
        <a
          href={`http://localhost:5000/uploads/${application.msceCertificate}`}
          target="_blank"
          rel="noreferrer"
        >
          View Certificate
        </a>
      </p>

      <p>
        Bank Slip:{" "}
        <a
          href={`http://localhost:5000/uploads/${application.bankSlip}`}
          target="_blank"
          rel="noreferrer"
        >
          View Bank Slip
        </a>
      </p>

      {/* ACTION BUTTONS */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => handleStatusChange("accepted")}
          style={{ background: "green", color: "white", marginRight: "10px" }}
        >
          Accept
        </button>

        <button
          onClick={() => handleStatusChange("rejected")}
          style={{ background: "red", color: "white" }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default ApplicationDetails;