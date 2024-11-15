import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000";

export const testBackend = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Error connecting to backend:", error);
    return { error: "Backend connection failed" };
  }
};
