import { useLocation, useNavigate } from "react-router-dom";
import API from "../../../services/api";
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

    // Append form data
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    // Append subjects
    form.append("subjects", JSON.stringify(subjects));

    // Append files
    form.append("passportPhoto", files.passportPhoto);
    form.append("msceCertificate", files.msceCertificate);
    form.append("bankSlip", files.bankSlip);

    // ✅ FIXED: NO manual headers
    await API.post("/applications", form);

    // go to success page
    navigate("/success");

  } catch (err) {
    console.error("❌ Submission error:", err);
    alert(err.message || "Submission failed");
  } finally {
    setLoading(false);
  }
};
     
  return (
  <div className="min-h-screen bg-gray-50 py-10 px-4">
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">

      {/* HEADER */}
      <h2 className="text-3xl font-bold text-darkText mb-2">
        Review Your Application 👀
      </h2>
      <p className="text-gray-500 mb-6">
        Please confirm all details before submitting
      </p>

      {/* PERSONAL INFO */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-darkText mb-3">
          Personal Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
          <p><span className="text-gray-500">Name:</span> <b>{formData.fullName}</b></p>
          <p><span className="text-gray-500">Email:</span> <b>{formData.email}</b></p>
          <p><span className="text-gray-500">Phone:</span> <b>{formData.phone}</b></p>
          <p><span className="text-gray-500">District:</span> <b>{formData.district}</b></p>
          <p className="md:col-span-2">
            <span className="text-gray-500">Program:</span>{" "}
            <b className="text-primary">{formData.program}</b>
          </p>
        </div>
      </div>

      {/* SUBJECTS */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-darkText mb-3">
          MSCE Subjects
        </h3>

        <div className="bg-gray-50 p-4 rounded-xl space-y-2">
          {subjects.map((s, i) => (
            <div key={i} className="flex justify-between border-b pb-1 last:border-none">
              <span>{s.name}</span>
              <span className="font-semibold">{s.gradePoints}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FILES */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-darkText mb-3">
          Uploaded Documents
        </h3>

        <div className="bg-gray-50 p-4 rounded-xl space-y-2">
          <p>
            <span className="text-gray-500">Passport Photo:</span>{" "}
            <b>{files.passportPhoto?.name || "Not uploaded"}</b>
          </p>
          <p>
            <span className="text-gray-500">MSCE Certificate:</span>{" "}
            <b>{files.msceCertificate?.name || "Not uploaded"}</b>
          </p>
          <p>
            <span className="text-gray-500">Bank Slip:</span>{" "}
            <b>{files.bankSlip?.name || "Not uploaded"}</b>
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col md:flex-row gap-3 mt-6">

        <button
          onClick={() => navigate(-1)}
          className="w-full md:w-1/2 border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-100 transition"
        >
          Go Back
        </button>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full md:w-1/2 bg-primary text-white p-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Confirm Submission"}
        </button>

      </div>

    </div>
  </div>
);
}

export default ReviewApplication;