import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",
  withCredentials: true,
});

// Helper to read cookie value by name
function getCookie(name) {
  const match = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\/\+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return match ? decodeURIComponent(match[1]) : null;
}



// Attach Authorization header from access_token cookie or localStorage
instance.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {};
  const url = (config.url || "").toString();
  const skipAuthHeader =
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/admin-register");

  if (!skipAuthHeader) {
    // Use httpOnly cookie for security
    const token = getCookie("access_token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
      }
  }
  return config;
});

// Add response interceptor for automatic token refresh and error handling
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || "";
    const isRefreshCall = url.includes("/auth/refresh");
    const isAuthCall =
      url.includes("/auth/login") || url.includes("/auth/register");
    const hasRefreshCookie = !!getCookie("refresh_token");

    if (
      status === 401 &&
      !originalRequest._retry &&
      !isRefreshCall &&
      !isAuthCall &&
      hasRefreshCookie
    ) {
      originalRequest._retry = true;

      try {
        await instance.post("/auth/refresh");
        return instance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth state and redirect to login
        localStorage.removeItem("auth_user");
        // Clear cookies
        document.cookie =
          "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
