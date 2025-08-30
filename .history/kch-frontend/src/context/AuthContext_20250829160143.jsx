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
    return getCookie("access_token");
  }, []);

  // Helper function to store user data in localStorage for persistence
  const storeUserData = useCallback((userData) => {
    if (userData) {
      localStorage.setItem("kch_user", JSON.stringify(userData));
      localStorage.setItem("kch_auth_timestamp", Date.now().toString());
    }
  }, []);

  // Helper function to get stored user data
  const getStoredUserData = useCallback(() => {
    try {
      const userData = localStorage.getItem("kch_user");
      const timestamp = localStorage.getItem("kch_auth_timestamp");
      
      if (userData && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        // Check if stored data is less than 24 hours old
        if (age < 24 * 60 * 60 * 1000) {
          return JSON.parse(userData);
        }
      }
    } catch (error) {
      console.error("Error reading stored user data:", error);
    }
    return null;
  }, []);

  // Helper function to clear stored user data
  const clearStoredUserData = useCallback(() => {
    localStorage.removeItem("kch_user");
    localStorage.removeItem("kch_auth_timestamp");
  }, []);

  // Logout function - defined before useEffect to avoid circular dependency
  const logout = useCallback(() => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    clearStoredUserData();

    // Clear cookies by setting expired cookies
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }, [clearStoredUserData]);

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, try to restore from localStorage (faster)
        const storedUser = getStoredUserData();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
          setIsInitialized(true);
          console.log("✅ Authentication restored from localStorage");
          return;
        }

        // If no stored data, check cookies and validate with backend
        const token = getCurrentToken();
        if (token) {
          console.log("🔍 Token found in cookies, validating with backend...");
          // Try to get current user data
          const response = await api.get("/auth/me");
          if (response.status === 200 && response.data.user) {
            const userData = response.data.user;
            setUser(userData);
            setIsAuthenticated(true);
            storeUserData(userData); // Store for future use
            console.log("✅ Authentication validated with backend");
          } else {
            // Token exists but user data is invalid, clear auth state
            console.log("❌ Token validation failed, clearing auth state");
            logout();
          }
        } else {
          console.log("ℹ️ No authentication tokens found");
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
  }, [getCurrentToken, logout, getStoredUserData, storeUserData]);

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
        // Send as URL-encoded form data for @RequestParam
        const formData = new URLSearchParams();
        formData.append("email", email);
        formData.append("password", password);

        const response = await safeAsync(
          () =>
            api.post("/auth/login", formData, {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }),
          null,
          "login operation"
        );

        if (response && response.status === 200) {
          const { user } = response.data;
          if (user) {
            setUser(user);
            setIsAuthenticated(true);
            storeUserData(user); // Store user data for persistence
            console.log("✅ Login successful, user data stored");
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
    [isLoading, storeUserData]
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
