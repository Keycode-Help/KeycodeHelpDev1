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
        // Clear stored auth state
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
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

  // Helper function to store auth state in localStorage
  const storeAuthState = useCallback((userData, token) => {
    if (userData) {
      localStorage.setItem("auth_user", JSON.stringify(userData));
    }
    if (token) {
      localStorage.setItem("auth_token", token);
    }
  }, []);

  // Helper function to clear stored auth state
  const clearStoredAuthState = useCallback(() => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  }, []);

  // Logout function - defined before useEffect to avoid circular dependency
  const logout = useCallback(() => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    
    // Clear stored auth state
    clearStoredAuthState();

    // Clear cookies by setting expired cookies
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }, [clearStoredAuthState]);

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First try to restore from localStorage (faster)
        const storedUser = localStorage.getItem("auth_user");
        const storedToken = localStorage.getItem("auth_token");
        
        if (storedUser && storedToken) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
            console.log("✅ Auth restored from localStorage");
          } catch (e) {
            console.error("Failed to parse stored user data:", e);
            clearStoredAuthState();
          }
        }

        // Then verify with backend (more secure)
        const token = getCurrentToken();
        if (token) {
          try {
            const response = await api.get("/auth/me");
            if (response.status === 200 && response.data.user) {
              const userData = response.data.user;
              setUser(userData);
              setIsAuthenticated(true);
              // Update stored data
              storeAuthState(userData, token);
              console.log("✅ Auth verified with backend");
            } else {
              console.log("❌ Backend auth failed, clearing state");
              logout();
            }
          } catch (error) {
            console.error("Backend auth check failed:", error);
            // Don't logout immediately, keep localStorage state for now
            // The interceptor will handle 401s
          }
        } else if (storedUser && storedToken) {
          // We have stored data but no cookie - try to refresh
          console.log("🔄 No cookie but stored data - attempting refresh");
          try {
            await api.post("/auth/refresh");
            // If refresh succeeds, we'll get new cookies
            const newToken = getCurrentToken();
            if (newToken) {
              storeAuthState(JSON.parse(storedUser), newToken);
              console.log("✅ Token refreshed successfully");
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            logout();
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        // Don't logout on initialization errors, keep stored state
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [getCurrentToken, logout, storeAuthState, clearStoredAuthState]);

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
          const { user: userData, accessToken } = response.data;
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            // Store auth state for persistence
            storeAuthState(userData, accessToken);
            console.log("✅ Login successful, auth state stored");
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
    [isLoading, storeAuthState]
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
