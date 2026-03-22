import API from "./api";

export const programService = {
  // Get all programs
  getAll: async () => {
    const response = await API.get("/programs");
    return response.data;
  },
  
  // Get program by ID
  getById: async (id) => {
    const response = await API.get(`/programs/${id}`);
    return response.data;
  },
  
  // Check eligibility
  checkEligibility: async (subjects) => {
    const response = await API.post("/programs/check-eligibility", { subjects });
    return response.data;
  }
};