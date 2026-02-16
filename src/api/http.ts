import axios, { AxiosError } from "axios";

type AxiosConfigWithSkip = any & { skipAuth?: boolean };

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
    // ❌ DO NOT set Content-Type here globally
  },
  timeout: 20000,
});

http.defaults.withCredentials = true;

http.interceptors.request.use((config: AxiosConfigWithSkip) => {
  // ✅ if FormData, remove Content-Type so browser sets multipart boundary
  if (config.data instanceof FormData) {
    delete config.headers?.["Content-Type"];
    delete config.headers?.["content-type"];
  } else {
    // for normal JSON requests
    config.headers = config.headers || {};
    config.headers["Content-Type"] = "application/json";
  }

  if (config?.skipAuth) return config;

  const token = localStorage.getItem("gls_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => Promise.reject(error)
);

export default http;
