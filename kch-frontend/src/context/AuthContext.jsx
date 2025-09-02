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

  // Helper function to get current token from cookies or localStorage
  const getCurrentToken = useCallback(() => {
    // Try cookie first, then localStorage
    const tokenFromCookie = getCookie("access_token");
    if (tokenFromCookie) return tokenFromCookie;

    return localStorage.getItem("auth_token");
  }, []);

  // Helper function to clear stored auth state
  const clearStoredAuthState = useCallback(() => {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
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
        // First try to restore from localStorage (faster)
        const storedUser = localStorage.getItem("auth_user");
        const storedToken = localStorage.getItem("auth_token");

        if (storedUser && storedToken) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
            console.log("✅ Auth restored from localStorage");
            
            // Only verify with backend if we're online and not in development
            if (navigator.onLine && !import.meta.env.DEV) {
              // Verify auth in background (non-blocking)
              api.get("/auth/me").then(response => {
                if (response.status === 200 && response.data.user) {
                  const userData = response.data.user;
                  setUser(userData);
                  storeAuthState(userData, storedToken);
                  console.log("✅ Auth verified with backend");
                }
              }).catch(error => {
                // Only clear auth on 401, ignore other errors
                if (error.response?.status === 401) {
                  console.log("❌ Token expired, clearing state");
                  logout();
                } else if (error.response?.status === 500) {
                  console.warn("Backend server error - keeping local auth state");
                }
              });
            }
          } catch (e) {
            console.error("Failed to parse stored user data:", e);
            clearStoredAuthState();
          }
        } else {
          // No stored auth, check with backend if we have a token
          const token = getCurrentToken();
          if (token && navigator.onLine) {
            try {
              const response = await api.get("/auth/me");
              if (response.status === 200 && response.data.user) {
                const userData = response.data.user;
                setUser(userData);
                setIsAuthenticated(true);
                storeAuthState(userData, token);
                console.log("✅ Auth verified with backend");
              }
            } catch (error) {
              if (error.response?.status === 401) {
                console.log("❌ Invalid token, clearing state");
                logout();
              }
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [clearStoredAuthState, getCurrentToken, logout, storeAuthState]);



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
