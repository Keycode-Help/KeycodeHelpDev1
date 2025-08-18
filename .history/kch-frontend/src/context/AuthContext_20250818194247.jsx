import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import api from "../services/request";
import {
  MessageChannelErrorHandler,
  safeAsync,
} from "../utils/messageChannelHandler";

// Configure axios to use credentials
api.defaults.withCredentials = true;

// Simple cookie reader
function getCookie(name) {
  const match = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\/+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return match ? decodeURIComponent(match[1]) : null;
}

// Add response interceptor for automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const url = originalRequest?.url || "";
    const isRefreshCall = url.includes("/auth/refresh");
    const isAuthCall = url.includes("/auth/login") || url.includes("/auth/register");
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
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.error("Token refresh failed:", refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to get current token from cookies
  const getCurrentToken = useCallback(() => {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("access_token=")
    );
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }, []);

  // Logout function - defined before useEffect to avoid circular dependency
  const logout = useCallback(() => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);

    // Clear cookies by setting expired cookies
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/auth/refresh;";
  }, []);

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a token
        const token = getCurrentToken();
        if (token) {
          // Try to get current user data
          const response = await api.get("/auth/me");
          if (response.status === 200 && response.data.user) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // Token exists but user data is invalid, clear auth state
            logout();
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        // Clear any invalid auth state
        logout();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [getCurrentToken, logout]);

  // Memoize the role setting logic to prevent unnecessary re-renders
  useEffect(() => {
    const newRole = user?.role || null;
    if (newRole !== userRole) {
      setUserRole(newRole);
    }
  }, [user?.role, userRole]);

  const login = useCallback(
    async (email, password) => {
      if (isLoading) return; // Prevent multiple simultaneous login attempts

      setIsLoading(true);
      try {
        const response = await safeAsync(
          () => api.post("/auth/login", { email, password }),
          null,
          "login operation"
        );

        if (response && response.status === 200) {
          const { user } = response.data;
          if (user) {
            setUser(user);
            setIsAuthenticated(true);
          } else {
            throw new Error("Login failed: Invalid response data.");
          }
        } else {
          throw new Error("Login failed");
        }
      } catch (error) {
        MessageChannelErrorHandler.handleAsyncError(error, "login operation");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        isAuthenticated,
        isLoading,
        isInitialized,
        login,
        logout,
        getCurrentToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
