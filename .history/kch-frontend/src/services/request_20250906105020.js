import axios from "axios";
import { supabase } from "./supabaseClient";

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
    // Try cookie first (access_token or next-auth.session-token), then localStorage
    const token = getCookie("access_token") || getCookie("next-auth.session-token") || getTokenFromStorage();
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
    const hasRefreshCookie = !!getCookie("refresh_token") || !!getCookie("next-auth.session-token");
    
    // Debug cookie information
    if (import.meta.env.DEV && (status === 401 || status === 403)) {
      console.log("🍪 Available cookies:", document.cookie.split(';').map(c => c.trim()));
      console.log("🔍 Refresh token check:", {
        refresh_token: !!getCookie("refresh_token"),
        nextAuthSession: !!getCookie("next-auth.session-token"),
        hasRefreshCookie: hasRefreshCookie
      });
    }

    // Handle 401 and 403 errors with token refresh
    if (
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      !isRefreshCall &&
      !isAuthCall &&
      hasRefreshCookie
    ) {
      originalRequest._retry = true;

      try {
        console.log(
          `🔄 Attempting token refresh for ${status} error on ${url}`
        );
        await instance.post("/auth/refresh", {}, { timeout: 5000 });
        console.log("✅ Token refresh successful, retrying original request");
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
        document.cookie =
          "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "next-auth.callback-url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle remaining 403 errors (after token refresh attempt)
    if (status === 403) {
      const isAuthMeCall = url.includes("/auth/me");
      const isTrialStatusCall = url.includes("/trial/status");
      const isAdminCall = url.includes("/admin-approval");
      
      // Log detailed debugging information
      console.warn("403 Forbidden error details:", {
        url: url,
        isAuthMeCall: isAuthMeCall,
        isTrialStatusCall: isTrialStatusCall,
        isAdminCall: isAdminCall,
        hasRefreshCookie: hasRefreshCookie,
        cookies: document.cookie.split(';').map(c => c.trim()),
        error: error.response?.data || error.message
      });
      
      if (isAuthMeCall) {
        // For /auth/me calls, just log a warning but don't logout
        console.warn(
          "403 on /auth/me - JWT token validation failed, but keeping local auth state"
        );
        return Promise.reject(error);
      } else if (isTrialStatusCall || isAdminCall) {
        // For trial status and admin calls, try to refresh token one more time
        console.warn(
          "403 on protected resource - attempting one more token refresh"
        );
        
        // Only attempt refresh if we haven't already tried and we have a refresh token
        if (!originalRequest._retry && hasRefreshCookie) {
          originalRequest._retry = true;
          try {
            console.log("🔄 Attempting final token refresh for 403 error");
            await instance.post("/auth/refresh", {}, { timeout: 5000 });
            console.log("✅ Final token refresh successful, retrying original request");
            return instance(originalRequest);
          } catch (refreshError) {
            console.error("Final token refresh failed:", refreshError);
            // Clear auth state and redirect to login
            localStorage.removeItem("auth_user");
            localStorage.removeItem("auth_token");
            document.cookie =
              "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "next-auth.callback-url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token or already tried, just reject
          console.warn(
            "403 on protected resource after refresh attempt - this might require logout"
          );
          return Promise.reject(error);
        }
      } else {
        // For other protected resources after refresh attempt failed
        console.warn(
          "403 on protected resource after refresh attempt - this might require logout"
        );
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
