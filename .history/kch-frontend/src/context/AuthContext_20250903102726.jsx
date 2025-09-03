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
    // Clear all auth-related localStorage items
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Clear any other potential auth-related items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.includes("auth") || key.includes("token") || key.includes("user"))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    console.log("🧹 Cleared all auth-related localStorage items");
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
    console.log("🚪 Logging out user - clearing all auth state");

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

    // Clear sessionStorage as well
    sessionStorage.clear();

    console.log("✅ Logout completed - all auth state cleared");
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
        } else {
          // No stored data, ensure we start clean
          console.log("🔍 No stored auth data found, starting fresh");
        }

        // Then verify with backend (more secure) - with timeout
        const token = getCurrentToken();
        if (token && storedUser && storedToken) {
          if (import.meta.env.DEV) {
            console.log(
              "🔑 Token found for /auth/me request:",
              token.substring(0, 20) + "..."
            );
          }
          try {
            // Add timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await api.get("/auth/me", {
              signal: controller.signal,
              timeout: 5000,
            });

            clearTimeout(timeoutId);

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

            // Handle different types of errors
            if (error.name === "AbortError" || error.code === "ECONNABORTED") {
              console.warn(
                "Backend auth request timed out - keeping local auth state"
              );
              // Keep localStorage state, backend might be slow
            } else if (error.response?.status === 500) {
              console.warn(
                "Backend server error (500) - keeping local auth state"
              );
              // Keep localStorage state for now, backend might be temporarily down
            } else if (error.response?.status === 403) {
              console.warn(
                "Backend auth endpoint returned 403 - JWT token validation failed, but keeping local auth state"
              );
              // Don't logout on 403 - this could be temporary backend issues
              // Keep the user logged in locally and let them continue using the app
              // The request interceptor will handle actual auth failures
            } else if (
              error.code === "ERR_NETWORK" ||
              error.message.includes("CORS")
            ) {
              console.warn(
                "CORS error detected - backend may not be configured for this domain"
              );
              // Keep localStorage state for now, but show warning
            } else if (error.response?.status === 401) {
              console.log("❌ Backend auth failed, clearing state");
              logout();
            }
            // Don't logout immediately for server errors, keep localStorage state for now
            // The interceptor will handle 401s
          }
        } else if (storedUser && storedToken) {
          // We have stored data but no cookie - try to refresh
          console.log("🔄 No cookie but stored data - attempting refresh");
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            await api.post(
              "/auth/refresh",
              {},
              {
                signal: controller.signal,
                timeout: 5000,
              }
            );

            clearTimeout(timeoutId);

            // If refresh succeeds, we'll get new cookies
            const newToken = getCurrentToken();
            if (newToken) {
              storeAuthState(JSON.parse(storedUser), newToken);
              console.log("✅ Token refreshed successfully");
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            if (refreshError.name !== "AbortError") {
              // If refresh fails, logout the user
              logout();
            }
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
  }, [getCurrentToken, storeAuthState, clearStoredAuthState, logout]);

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

// Global debug function to clear all auth data (for debugging)
if (typeof window !== "undefined") {
  window.clearAllAuthData = () => {
    console.log("🧹 Manual auth data clear initiated...");

    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Clear any cache
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }

    console.log("✅ All auth data cleared! Please refresh the page.");
  };
}
