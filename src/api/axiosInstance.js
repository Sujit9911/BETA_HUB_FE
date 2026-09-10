import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const isAuthRequest = config.url?.startsWith("/auth/");

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /*
     * FormData uploads
     *
     * Do NOT send application/json for FormData.
     * Let Axios/browser automatically create:
     *
     * multipart/form-data; boundary=...
     */
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    console.log("AXIOS STATUS:", error.response?.status);
    console.log("AXIOS DATA:", error.response?.data);
    console.log("AXIOS URL:", error.config?.url);

    const status = error.response?.status;
    const url = error.config?.url || "";

    /*
     * IMPORTANT:
     *
     * Do NOT redirect to /login when the 401 comes
     * from the login endpoint itself.
     *
     * Otherwise a wrong password causes the page to
     * reload and the Login component loses its error state.
     */
    const isAuthRequest = url.startsWith("/auth/");

    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;