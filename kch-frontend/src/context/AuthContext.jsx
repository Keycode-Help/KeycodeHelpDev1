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

// Response interceptor is now handled in request.js service

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to get current token from cookies only (more secure)
  const getCurrentToken = useCallback(() => {
    return getCookie("access_token");
  }, []);

  // Helper function to clear stored auth state
  const clearStoredAuthState = useCallback(() => {
    localStorage.removeItem("auth_user");
  }, []);

  // Helper function to store minimal user data for offline fallback
  const storeMinimalUserData = useCallback((userData) => {
    if (userData) {
      localStorage.setItem("auth_user", JSON.stringify({
        id: userData.id,
        email: userData.email,
        role: userData.role
      }));
    }
  }, []);

  // Logout function - defined after dependencies to avoid circular dependency
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
        // Check for valid token (prioritize httpOnly cookies for security)
        const token = getCurrentToken();
        if (token) {
          try {
            const response = await api.get("/auth/me");
            if (response.status === 200 && response.data.user) {
              const userData = response.data.user;
              setUser(userData);
              setIsAuthenticated(true);
              // Only store minimal data for offline fallback
              localStorage.setItem("auth_user", JSON.stringify({
                id: userData.id,
                email: userData.email,
                role: userData.role
              }));
            } else {
              logout();
            }
          } catch (error) {
            console.error("Backend auth check failed:", error);

                        // Handle authentication errors appropriately
            if (error.response?.status === 401) {
              logout();
            }
            // For other errors (500, network), keep user logged out for security
            // The backend should be reliable in production
          }
        } else if (storedUser && storedToken) {
          // We have stored data but no cookie - try to refresh

          try {
            await api.post("/auth/refresh");
            // If refresh succeeds, we'll get new cookies
            const newToken = getCurrentToken();
            if (newToken) {
              const userData = JSON.parse(storedUser);
              setUser(userData);
              setIsAuthenticated(true);
            }
          } catch (refreshError) {
            logout();
          }
        }
      } catch (error) {
        // Don't logout on initialization errors, keep stored state
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [getCurrentToken, storeMinimalUserData, clearStoredAuthState]);

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
            // Store minimal user data for offline fallback
            storeMinimalUserData(userData);

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
    [isLoading, storeMinimalUserData]
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
