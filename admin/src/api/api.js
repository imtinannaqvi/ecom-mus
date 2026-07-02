import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:3000/api", // Backend port check karein
  withCredentials: true,
});

// Attach the admin JWT (set at login) to every request as a Bearer token.
Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Api;
