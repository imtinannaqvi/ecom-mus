import axios from "axios";

export const BACKEND_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://localhost:3000"
      : "");

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});

export default API;