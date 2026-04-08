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
  <div className="min-h-screen bg-gray-50 py-10 px-4">
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">

      {/* HEADER */}
      <h2 className="text-3xl font-bold text-darkText mb-2">
        Student Application 🎓
      </h2>
      <p className="text-gray-500 mb-6">
        Complete your application step by step
      </p>

      {/* PROGRESS */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
        <div
          className={`h-3 transition-all duration-500 ${
            progress === 100 ? "bg-green-500" : "bg-primary"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Progress: <span className="font-semibold">{progress}%</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* PERSONAL INFO */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-darkText">
            Personal Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                required
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                District
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                required
              >
                <option value="">Select District</option>
                {malawiDistricts.map((district) => (
                  <option key={district}>{district}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
        </div>

        {/* SUBJECTS */}
        <div>
          <h3 className="text-xl font-semibold mb-2 text-darkText">
            MSCE Subjects
          </h3>

          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <div key={subject.name} className="p-4 border rounded-xl bg-gray-50">
                <label className="block text-sm font-semibold mb-2">
                  {subject.name} (Grade Points)
                </label>

                <select
                  value={subject.gradePoints}
                  onChange={(e) =>
                    handleSubjectChange(index, "gradePoints", e.target.value)
                  }
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  required
                >
                  <option value="">Select Points</option>
                  {gradePoints.map((point) => (
                    <option key={point} value={point}>
                      {point}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* CHECK */}
        <button
          type="button"
          onClick={checkEligibility}
          className="w-full bg-accent text-white p-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Check Program Eligibility
        </button>

        {/* PROGRAMS */}
        {showPrograms && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-darkText">
              Program Selection
            </h3>

            {eligiblePrograms.length > 0 ? (
              <div className="space-y-3">
                {eligiblePrograms.map((program) => (
                  <div
                    key={program.id}
                    onClick={() =>
                      setFormData({ ...formData, program: program.id })
                    }
                    className={`p-4 rounded-xl border cursor-pointer ${
                      formData.program === program.id
                        ? "border-primary bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <p className="font-semibold">{program.name}</p>
                    <p className="text-sm text-gray-500">
                      {program.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-red-100 text-red-600 p-4 rounded-lg">
                Not eligible for any program
              </div>
            )}
          </div>
        )}

        {/* FILES */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-darkText">
            Upload Documents
          </h3>

          <div className="space-y-3">

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Passport Photo
              </label>
              <input type="file" name="passportPhoto" onChange={handleFileChange} className="w-full border p-2 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                MSCE Certificate
              </label>
              <input type="file" name="msceCertificate" onChange={handleFileChange} className="w-full border p-2 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Bank Slip
              </label>
              <input type="file" name="bankSlip" onChange={handleFileChange} className="w-full border p-2 rounded-lg" />
            </div>

          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Submit Application
        </button>

      </form>
    </div>
  </div>
);
}

export default Apply;