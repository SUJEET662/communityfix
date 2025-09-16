import api from "./api";

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/api/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await api.get("/api/auth/user");
    return response.data;
  } catch (error) {
    localStorage.removeItem("token");
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
