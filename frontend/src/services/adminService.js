import API from "./api";

// ================= DASHBOARD =================

// 🔥 Get dashboard stats
export const getDashboardStats = async () => {
  const res = await API.get("/admin/dashboard");
  return res.data;
};

// ================= APPLICATIONS =================

// 🔥 Get all applications
export const getAllApplications = async () => {
  const res = await API.get("/admin/applications");
  return res.data;
};

// 🔥 Update application status (accept/reject)
export const updateApplicationStatus = async (id, status) => {
  const res = await API.put(`/admin/applications/${id}/status`, { status });
  return res.data;
};

// 🔥 Get single application
export const getApplicationById = async (id) => {
  const res = await API.get(`/admin/applications/${id}`);
  return res.data;
};

export const getAcceptedStudents = async () => {
  const res = await API.get("/admin/applications?status=accepted");
  return res.data;
};

