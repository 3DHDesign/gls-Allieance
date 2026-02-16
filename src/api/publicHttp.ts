import axios from "axios";

const publicHttp = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { Accept: "application/json" },
  timeout: 20000,
});

// ✅ REQUIRED: keep session between verify-otp -> change
publicHttp.defaults.withCredentials = true;

export default publicHttp;
