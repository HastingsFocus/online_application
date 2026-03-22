import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useState } from "react";

function ReviewApplication() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!state) {
    return <p>No data found</p>;
  }

  const { formData, subjects, files } = state;

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      form.append("subjects", JSON.stringify(subjects));

      form.append("passportPhoto", files.passportPhoto);
      form.append("msceCertificate", files.msceCertificate);
      form.append("bankSlip", files.bankSlip);

      await API.post("/applications", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // go to success page
      navigate("/success");

    } catch (err) {
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto" }}>
      <h2>Review Your Application</h2>

      <p style={{ color: "#555" }}>
        Please confirm that the information below is correct before submitting.
      </p>

      {/* PERSONAL INFO */}
      <h3>Personal Info</h3>
      <p><b>Name:</b> {formData.fullName}</p>
      <p><b>Email:</b> {formData.email}</p>
      <p><b>Phone:</b> {formData.phone}</p>
      <p><b>District:</b> {formData.district}</p>
      <p><b>Program:</b> {formData.program}</p>

      {/* SUBJECTS */}
      <h3>Subjects</h3>
      {subjects.map((s, i) => (
        <p key={i}>
          {s.name}: <b>{s.gradePoints}</b>
        </p>
      ))}

      {/* FILES */}
      <h3>Uploaded Files</h3>
      <p>Passport: {files.passportPhoto?.name}</p>
      <p>MSCE: {files.msceCertificate?.name}</p>
      <p>Bank Slip: {files.bankSlip?.name}</p>

      {/* BUTTONS */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate(-1)} style={{ marginRight: "10px" }}>
          Cancel
        </button>

        <button onClick={handleConfirm} disabled={loading}>
          {loading ? "Submitting..." : "Confirm Submission"}
        </button>
      </div>
    </div>
  );
}

export default ReviewApplication;