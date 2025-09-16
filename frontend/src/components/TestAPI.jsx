import React from "react";
import api from "./services/api";

const TestAPI = () => {
  const testConnection = async () => {
    console.log("Testing API connection...");
    console.log(
      "API_BASE_URL should be: https://communityfix-backend.onrender.com"
    );

    try {
      const response = await api.get("/api/issues?limit=1");
      console.log("✅ Success:", response.data);
    } catch (error) {
      console.log("❌ Error:", error.message);
      console.log("Full error:", error);
    }
  };

  return (
    <div>
      <button onClick={testConnection}>Test API Connection</button>
    </div>
  );
};

export default TestAPI;
