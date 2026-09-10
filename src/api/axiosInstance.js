import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// Request Interceptor
// ===============================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    const isAuthRequest = config.url?.startsWith("/auth/");

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// Response Interceptor
// ===============================
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    console.log("AXIOS STATUS:", error.response?.status);
    console.log("AXIOS DATA:", error.response?.data);
    console.log("AXIOS URL:", error.config?.url);

    const status = error.response?.status;
    const url = error.config?.url || "";

    const isAuthRequest = url.startsWith("/auth/");

    /*
     * IMPORTANT:
     * Do NOT redirect when login/register itself returns 401.
     *
     * Otherwise the Login page reloads and its error message
     * disappears immediately.
     */
    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;