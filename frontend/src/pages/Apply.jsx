import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useEffect } from "react";

function Apply() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(() => {
  const saved = localStorage.getItem("formData");
  return saved ? JSON.parse(saved) : {
    fullName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    district: "",
    address: "",
    program: ""
  };
});
  
const [subjects, setSubjects] = useState(() => {
  const saved = localStorage.getItem("subjects");
  return saved ? JSON.parse(saved) : [
    { name: "English", gradePoints: "" },
    { name: "Mathematics", gradePoints: "" },
    { name: "Physics", gradePoints: "" },
    { name: "Chemistry", gradePoints: "" },
    { name: "Biology", gradePoints: "" },
    { name: "Agriculture", gradePoints: "" },
    { name: "Chichewa", gradePoints: "" }
  ];
});
  const [files, setFiles] = useState({
    passportPhoto: null,
    msceCertificate: null,
    bankSlip: null
  });

   useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // ✅ SAVE subjects to localStorage
  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);
  
  const [progress, setProgress] = useState(0);
  const [eligiblePrograms, setEligiblePrograms] = useState([]);
  const [showPrograms, setShowPrograms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All 28 districts in Malawi organized by region
  const malawiDistricts = [
    // Northern Region
    "Chitipa", "Karonga", "Likoma", "Mzimba", "Nkhata Bay", "Rumphi",
    // Central Region
    "Dedza", "Dowa", "Kasungu", "Lilongwe", "Mchinji", "Nkhotakota", 
    "Ntcheu", "Ntchisi", "Salima",
    // Southern Region
    "Balaka", "Blantyre", "Chikwawa", "Chiradzulu", "Machinga", "Mangochi", 
    "Mulanje", "Mwanza", "Nsanje", "Thyolo", "Phalombe", "Zomba", "Neno"
  ].sort();

  // Grade points from 1-9 (1 being best, 9 being worst)
  const gradePoints = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    calculateProgress(updated);
  };

  // Update subjects
  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
    calculateProgress(formData);
  };

  // Check program eligibility based on grades
  const checkEligibility = () => {
    // Check if all subjects have grades
    const allGradesFilled = subjects.every(subject => subject.gradePoints !== "");
    
    if (!allGradesFilled) {
      alert("Please fill in all subject grades first");
      return;
    }

    const eligible = [];

    // Helper function to check if subject meets minimum points
    const meetsRequirement = (subjectName, minPoints) => {
      const subject = subjects.find(s => s.name === subjectName);
      return subject && parseInt(subject.gradePoints) <= minPoints;
    };

    // Check Diploma in Public Health (all subjects 6 including Maths, English, Physics)
    const publicHealthEligible = 
      meetsRequirement("English", 6) &&
      meetsRequirement("Mathematics", 6) &&
      meetsRequirement("Physics", 6) &&
      subjects.every(s => parseInt(s.gradePoints) <= 6);

    if (publicHealthEligible) {
      eligible.push({
        id: "DIP-PH",
        name: "Diploma in Public Health",
        description: "Minimum of 6 in all subjects including English, Mathematics, and Physics"
      });
    }

    // Check Diploma in Midwifery (minimum 5 in all subjects including English, Maths, Physics, Chemistry, Biology)
    const midwiferyEligible = 
      meetsRequirement("English", 5) &&
      meetsRequirement("Mathematics", 5) &&
      meetsRequirement("Physics", 5) &&
      meetsRequirement("Chemistry", 5) &&
      meetsRequirement("Biology", 5) &&
      subjects.every(s => parseInt(s.gradePoints) <= 5);

    if (midwiferyEligible) {
      eligible.push({
        id: "DIP-MID",
        name: "Diploma in Midwifery",
        description: "Minimum of 5 in all subjects including English, Mathematics, Physics, Chemistry, and Biology"
      });
    }

    // Check Diploma in Pharmacy (minimum 5 in all subjects including English, Maths, Physics, Chemistry, Biology)
    const pharmacyEligible = 
      meetsRequirement("English", 5) &&
      meetsRequirement("Mathematics", 5) &&
      meetsRequirement("Physics", 5) &&
      meetsRequirement("Chemistry", 5) &&
      meetsRequirement("Biology", 5) &&
      subjects.every(s => parseInt(s.gradePoints) <= 5);

    if (pharmacyEligible) {
      eligible.push({
        id: "DIP-PHARM",
        name: "Diploma in Pharmacy",
        description: "Minimum of 5 in all subjects including English, Mathematics, Physics, Chemistry, and Biology"
      });
    }

    setEligiblePrograms(eligible);
    setShowPrograms(true);

    if (eligible.length === 0) {
      alert("Sorry, you are not eligible for any of our programs based on your grades.");
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles({ ...files, [name]: selectedFiles[0] });
      calculateProgress(formData);
    }
  };

  // Calculate progress
  const calculateProgress = (data) => {
    let filled = 0;
    let total = Object.keys(data).length;
    Object.values(data).forEach((value) => {
      if (value !== "") filled++;
    });
    
    // Add subject completion to progress
    const subjectsFilled = subjects.filter(s => s.gradePoints !== "").length;
    const totalSubjects = subjects.length;
    const subjectProgress = (subjectsFilled / totalSubjects) * 100;
    
    // Add file completion to progress
    const filesFilled = Object.values(files).filter(file => file !== null).length;
    const totalFiles = Object.keys(files).length;
    const fileProgress = (filesFilled / totalFiles) * 100;
    
    const formProgress = (filled / total) * 100;
    const overallProgress = Math.round((formProgress + subjectProgress + fileProgress) / 3);
    
    setProgress(overallProgress);
  };

  // Submit form - UPDATED with navigation to review page
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if program is selected
    if (!formData.program) {
      alert("Please select a program");
      return;
    }
    
    // Check if all subjects have grades
    const allGradesFilled = subjects.every(subject => subject.gradePoints !== "");
    if (!allGradesFilled) {
      alert("Please fill in all subject grades");
      return;
    }
    
    // Check if all files are uploaded
    const allFilesFilled = Object.values(files).every(file => file !== null);
    if (!allFilesFilled) {
      alert("Please upload all required documents");
      return;
    }
    
    // Navigate to review page with all form data
    navigate("/review", {
      state: {
        formData,
        subjects,
        files
      }
    });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "10px" }}>
      <h2>Student Application</h2>

      <div style={{ background: "#eee", height: "20px", margin: "10px 0", borderRadius: "10px", overflow: "hidden" }}>
        <div
          style={{
            background: progress === 100 ? "#28a745" : "#17a2b8",
            height: "100%",
            width: `${progress}%`,
            transition: "width 0.3s ease-in-out"
          }}
        ></div>
      </div>
      <p>Application Progress: <b>{progress}%</b></p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* PERSONAL INFO */}
        <h3>Personal Information</h3>

        <div style={{ marginBottom: "10px" }}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={{ display: "block", width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{ display: "block", width: "100%", padding: "8px" }}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            style={{ display: "block", width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ display: "block", width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ display: "block", width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            style={{ display: "block", width: "100%", padding: "8px" }}
            required
          >
            <option value="">Select District</option>
            {malawiDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={{ display: "block", width: "100%", minHeight: "60px", padding: "8px" }}
            required
          />
        </div>

        {/* SUBJECTS - Now first before program */}
        <h3>MSCE Subjects</h3>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
          Please enter your MSCE grade points (1-9, where 1 is highest)
        </p>
        
        {subjects.map((subject, index) => (
          <div 
            key={subject.name} 
            style={{ 
              marginBottom: "15px", 
              padding: "15px", 
              border: "1px solid #ddd", 
              borderRadius: "4px",
              background: "#f9f9f9"
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontWeight: "bold" }}>{subject.name}</label>
            </div>
            
            <div>
              <label>Grade Points</label>
              <select
                value={subject.gradePoints}
                onChange={(e) => handleSubjectChange(index, "gradePoints", e.target.value)}
                style={{ display: "block", width: "100%", padding: "8px" }}
                required
              >
                <option value="">Select Points</option>
                {gradePoints.map((point) => (
                  <option key={point} value={point}>
                    {point} {point === 1 ? "(Highest)" : point === 9 ? "(Lowest)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {/* Check Eligibility Button */}
        <button 
          type="button" 
          onClick={checkEligibility} 
          style={{ 
            marginBottom: "20px", 
            padding: "10px 20px",
            background: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            width: "100%"
          }}
        >
          Check Program Eligibility
        </button>

        {/* PROGRAM SELECTION - Shows based on eligibility */}
        {showPrograms && (
          <>
            <h3>Program Selection</h3>
            {eligiblePrograms.length > 0 ? (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ color: "#28a745", fontWeight: "bold" }}>
                  You are eligible for the following programs:
                </p>
                {eligiblePrograms.map((program) => (
                  <div 
                    key={program.id}
                    style={{ 
                      marginBottom: "10px",
                      padding: "15px",
                      border: formData.program === program.id ? "2px solid #007bff" : "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                      background: formData.program === program.id ? "#e7f3ff" : "white"
                    }}
                    onClick={() => setFormData({...formData, program: program.id})}
                  >
                    <input
                      type="radio"
                      name="program"
                      value={program.id}
                      checked={formData.program === program.id}
                      onChange={(e) => setFormData({...formData, program: e.target.value})}
                      style={{ marginRight: "10px" }}
                    />
                    <strong>{program.name}</strong>
                    <p style={{ fontSize: "14px", color: "#666", margin: "5px 0 0 25px" }}>
                      {program.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                background: "#f8d7da", 
                color: "#721c24", 
                padding: "15px", 
                borderRadius: "4px", 
                marginBottom: "20px" 
              }}>
                <strong>Not Eligible</strong>
                <p style={{ margin: "5px 0 0 0" }}>
                  Based on your grades, you are not eligible for any of our programs at this time.
                </p>
              </div>
            )}
          </>
        )}

        {/* DOCUMENT UPLOAD */}
        <h3>Upload Documents</h3>
        <div style={{ marginBottom: "15px" }}>
          <label>Passport Photo</label>
          <input 
            type="file" 
            name="passportPhoto" 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: "block", marginTop: "5px" }}
            required 
          />
          {files.passportPhoto && (
            <small style={{ color: "green" }}>Selected: {files.passportPhoto.name}</small>
          )}
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label>MSCE Certificate</label>
          <input 
            type="file" 
            name="msceCertificate" 
            onChange={handleFileChange} 
            accept=".pdf,.jpg,.jpeg,.png" 
            style={{ display: "block", marginTop: "5px" }}
            required 
          />
          {files.msceCertificate && (
            <small style={{ color: "green" }}>Selected: {files.msceCertificate.name}</small>
          )}
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <label>Bank Slip</label>
          <input 
            type="file" 
            name="bankSlip" 
            onChange={handleFileChange} 
            accept=".pdf,.jpg,.jpeg,.png" 
            style={{ display: "block", marginTop: "5px" }}
            required 
          />
          {files.bankSlip && (
            <small style={{ color: "green" }}>Selected: {files.bankSlip.name}</small>
          )}
        </div>

        <button 
          type="submit" 
          style={{ 
            marginTop: "20px", 
            padding: "12px 20px", 
            background: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            width: "100%"
          }}
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default Apply;