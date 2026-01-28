import axios, { AxiosError } from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// ✅ Optional: if backend uses cookies/session auth, keep this ON.
// If not needed, set it to false or remove.
http.defaults.withCredentials = true;

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    // Normalize error message for UI
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed";
    return Promise.reject(new Error(msg));
  }
);

export default http;
