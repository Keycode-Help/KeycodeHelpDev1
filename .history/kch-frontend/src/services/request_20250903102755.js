import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",
  withCredentials: true,
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
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

// Helper to get token from localStorage (fallback)
function getTokenFromStorage() {
  return localStorage.getItem("auth_token");
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
    // Try cookie first, then localStorage
    const token = getCookie("access_token") || getTokenFromStorage();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
      if (import.meta.env.DEV) {
        console.log(
          "🔑 Adding Authorization header:",
          `Bearer ${token.substring(0, 20)}...`
        );
      }
    } else if (import.meta.env.DEV) {
      console.log("❌ No token found for request to:", url);
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

    // Handle 401 errors with token refresh
    if (
      status === 401 &&
      !originalRequest._retry &&
      !isRefreshCall &&
      !isAuthCall &&
      hasRefreshCookie
    ) {
      originalRequest._retry = true;

      try {
        await instance.post("/auth/refresh", {}, { timeout: 5000 });
        return instance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth state and redirect to login
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
        // Clear cookies
        document.cookie =
          "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 errors more gracefully
    if (status === 403) {
      const isAuthMeCall = url.includes("/auth/me");
      if (isAuthMeCall) {
        // For /auth/me calls, just log a warning but don't logout
        console.warn("403 on /auth/me - JWT token validation failed, but keeping local auth state");
        return Promise.reject(error);
      } else {
        // For other protected resources, this might be a real authorization issue
        console.warn("403 on protected resource - this might require logout");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
