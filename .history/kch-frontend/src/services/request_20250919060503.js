import axios from "axios";
import { supabase } from "./supabaseClient";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",
  withCredentials: true,
  timeout: import.meta.env.PROD ? 60000 : 30000, // 60s for production, 30s for dev
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

// Attach Authorization header from Supabase session or fallback
instance.interceptors.request.use(async (config) => {
  if (!config.headers) config.headers = {};
  const url = (config.url || "").toString();
  const skipAuthHeader =
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/admin-register");

  if (!skipAuthHeader) {
    try {
      // First try to get backend JWT token from cookies
      let token = getCookie("access_token");

      if (token) {
        if (import.meta.env.DEV) {
          console.log(
            "🔑 Using backend JWT token:",
            `Bearer ${token.substring(0, 20)}...`
          );
        }
      } else {
        // Fallback to localStorage token
        token = getTokenFromStorage();
        if (token && import.meta.env.DEV) {
          console.log(
            "🔑 Using localStorage token:",
            `Bearer ${token.substring(0, 20)}...`
          );
        }
      }

      if (token) {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else if (import.meta.env.DEV) {
        console.log("❌ No token found for request to:", url);
      }
    } catch (error) {
      console.warn("Failed to get token for request:", error);
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
    // Check if we have a backend refresh token
    const hasRefreshToken = !!getCookie("refresh_token");

    // Debug token information
    if (import.meta.env.DEV && (status === 401 || status === 403)) {
      console.log(
        "🍪 Available cookies:",
        document.cookie.split(";").map((c) => c.trim())
      );
      console.log("🔍 Refresh token check:", {
        hasSupabaseSession: hasRefreshToken,
        refresh_token: !!getCookie("refresh_token"),
        nextAuthSession: !!getCookie("next-auth.session-token"),
      });
    }

    // Handle 401 and 403 errors with token refresh
    if (
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      !isRefreshCall &&
      !isAuthCall &&
      hasRefreshToken
    ) {
      originalRequest._retry = true;

      try {
        console.log(
          `🔄 Attempting backend token refresh for ${status} error on ${url}`
        );

        // Use backend refresh endpoint
        const refreshResponse = await api.post("/auth/refresh");

        if (refreshResponse.data.status !== "ok") {
          throw new Error("Refresh failed");
        }

        console.log(
          "✅ Backend token refresh successful, retrying original request"
        );
        return instance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth state and redirect to login
        console.error("Backend token refresh failed:", refreshError);

        // Clear localStorage
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
      const isAdminCall =
        url.includes("/admin-approval") || url.includes("/admin/");

      // Log detailed debugging information
      console.warn("403 Forbidden error details:", {
        url: url,
        isAuthMeCall: isAuthMeCall,
        isTrialStatusCall: isTrialStatusCall,
        isAdminCall: isAdminCall,
        hasRefreshToken: hasRefreshToken,
        cookies: document.cookie.split(";").map((c) => c.trim()),
        error: error.response?.data || error.message,
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
        if (!originalRequest._retry && hasRefreshToken) {
          originalRequest._retry = true;
          try {
            console.log("🔄 Attempting final token refresh for 403 error");
            await instance.post("/auth/refresh", {}, { timeout: 5000 });
            console.log(
              "✅ Final token refresh successful, retrying original request"
            );
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
          // No refresh token or already tried, clear auth and redirect
          console.warn(
            "403 on protected resource - session expired, clearing auth and redirecting to login"
          );
          
          // Clear all auth data
          localStorage.removeItem("auth_user");
          localStorage.removeItem("auth_token");
          
          // Clear all cookies
          const cookiesToClear = [
            "access_token", "refresh_token", "next-auth.session-token", 
            "next-auth.csrf-token", "next-auth.callback-url"
          ];
          
          cookiesToClear.forEach(cookieName => {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          });
          
          // Show user-friendly message and redirect
          if (window.location.pathname !== '/login') {
            alert('Your session has expired. Please log in again.');
            window.location.href = '/login';
          }
          
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
