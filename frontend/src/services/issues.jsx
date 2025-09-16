import api from "./api";

export const issueService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== "") {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(`/api/issues?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/issues/${id}`);
    return response.data;
  },

  create: async (issueData) => {
    const response = await api.post("/api/issues", issueData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (id, issueData) => {
    const response = await api.put(`/api/issues/${id}`, issueData);
    return response.data;
  },

  vote: async (id, voteType) => {
    const response = await api.post(`/api/issues/${id}/vote`, { voteType });
    return response.data;
  },

  getCategories: () => {
    return ["Infrastructure", "Sanitation", "Safety", "Environment", "Other"];
  },

  getStatuses: () => {
    return ["reported", "in_progress", "resolved", "closed"];
  },
};
