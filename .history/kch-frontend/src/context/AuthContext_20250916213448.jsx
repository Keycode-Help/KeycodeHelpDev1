import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import api from "../services/request";
import { supabase } from "../services/supabaseClient";
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

  // Helper function to get current token from Supabase session or fallback
  const getCurrentToken = useCallback(async () => {
    try {
      // First try to get Supabase session token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        return session.access_token;
      }
    } catch (error) {
      console.warn("Failed to get Supabase session:", error);
    }

    // Fallback to cookies or localStorage
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
    try {
      if (userData) {
        // Only store essential user data to avoid quota issues
        const essentialUserData = {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isActive: userData.isActive,
          trialExpiry: userData.trialExpiry,
          subscriptionStatus: userData.subscriptionStatus,
        };
        
        const userDataString = JSON.stringify(essentialUserData);
        console.log(`📊 Storing user data (${userDataString.length} characters):`, essentialUserData);
        
        // Check if the data size is reasonable (< 1MB)
        if (userDataString.length > 1024 * 1024) {
          console.warn("⚠️ User data is very large, truncating...");
          // Store only the most essential data
          const minimalUserData = {
            id: userData.id,
            email: userData.email,
            role: userData.role,
          };
          localStorage.setItem("auth_user", JSON.stringify(minimalUserData));
        } else {
          localStorage.setItem("auth_user", userDataString);
        }
      }
      
      if (token) {
        console.log(`🔑 Storing auth token (${token.length} characters)`);
        localStorage.setItem("auth_token", token);
      }
    } catch (error) {
      console.error("❌ Failed to store auth state:", error);
      
      if (error.name === 'QuotaExceededError') {
        console.log("🧹 localStorage quota exceeded, clearing old data...");
        
        // Clear non-essential localStorage items
        const keysToKeep = ['auth_user', 'auth_token'];
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && !keysToKeep.includes(key)) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach((key) => {
          console.log(`🗑️ Removing localStorage item: ${key}`);
          localStorage.removeItem(key);
        });
        
        // Try storing again with minimal data
        try {
          if (userData) {
            const minimalUserData = {
              id: userData.id,
              email: userData.email,
              role: userData.role,
            };
            localStorage.setItem("auth_user", JSON.stringify(minimalUserData));
          }
          if (token) {
            localStorage.setItem("auth_token", token);
          }
          console.log("✅ Auth state stored successfully after cleanup");
        } catch (retryError) {
          console.error("❌ Failed to store auth state even after cleanup:", retryError);
          // Fall back to sessionStorage or just use in-memory storage
          console.log("🔄 Falling back to sessionStorage...");
          try {
            if (userData) {
              sessionStorage.setItem("auth_user", JSON.stringify({
                id: userData.id,
                email: userData.email,
                role: userData.role,
              }));
            }
            if (token) {
              sessionStorage.setItem("auth_token", token);
            }
          } catch (sessionError) {
            console.error("❌ SessionStorage also failed:", sessionError);
            // At this point, we'll just rely on in-memory state
          }
        }
      }
    }
  }, []);

  // Logout function - defined after dependencies to avoid circular dependency
  const logout = useCallback(async () => {
    console.log("🚪 Logging out user - clearing all auth state");

    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.warn("Supabase signout error:", error);
    }

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
    document.cookie =
      "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "next-auth.callback-url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Clear sessionStorage as well
    sessionStorage.clear();

    console.log("✅ Logout completed - all auth state cleared");
  }, [clearStoredAuthState]);

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check Supabase session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Supabase session error:", error);
        }

        if (session?.user) {
          // We have a valid Supabase session
          const userData = {
            id: session.user.id,
            email: session.user.email,
            role: session.user.user_metadata?.role || "BASEUSER",
            ...session.user.user_metadata,
          };

          console.log("🔍 Supabase user data:", {
            user: session.user,
            user_metadata: session.user.user_metadata,
            assigned_role: userData.role,
            email: userData.email,
          });

          setUser(userData);
          setIsAuthenticated(true);
          storeAuthState(userData, session.access_token);
          console.log("✅ Auth initialized from Supabase session");
        } else {
          // No Supabase session, check localStorage fallback
          let storedUser = localStorage.getItem("auth_user");
          let storedToken = localStorage.getItem("auth_token");
          let storageType = "localStorage";

          // If not found in localStorage, check sessionStorage
          if (!storedUser || !storedToken) {
            storedUser = sessionStorage.getItem("auth_user");
            storedToken = sessionStorage.getItem("auth_token");
            storageType = "sessionStorage";
          }

          if (storedUser && storedToken) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
              setIsAuthenticated(true);
              console.log(`✅ Auth restored from ${storageType} fallback`);
            } catch (e) {
              console.error("Failed to parse stored user data:", e);
              clearStoredAuthState();
              // Also clear sessionStorage
              sessionStorage.removeItem("auth_user");
              sessionStorage.removeItem("auth_token");
            }
          } else {
            console.log("🔍 No auth data found, starting fresh");
          }
        }

        // Listen for Supabase auth state changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("🔄 Supabase auth state changed:", event);

          if (event === "SIGNED_IN" && session?.user) {
            const userData = {
              id: session.user.id,
              email: session.user.email,
              role: session.user.user_metadata?.role || "BASEUSER",
              ...session.user.user_metadata,
            };

            console.log("🔍 Sign in user data:", {
              user: session.user,
              user_metadata: session.user.user_metadata,
              assigned_role: userData.role,
              email: userData.email,
            });

            setUser(userData);
            setIsAuthenticated(true);
            storeAuthState(userData, session.access_token);
            console.log("✅ User signed in via Supabase");
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setIsAuthenticated(false);
            clearStoredAuthState();
            console.log("✅ User signed out via Supabase");
          } else if (event === "TOKEN_REFRESHED" && session?.user) {
            const userData = {
              id: session.user.id,
              email: session.user.email,
              role: session.user.user_metadata?.role || "USER",
              ...session.user.user_metadata,
            };

            setUser(userData);
            setIsAuthenticated(true);
            storeAuthState(userData, session.access_token);
            console.log("✅ Token refreshed via Supabase");
          }
        });

        // Cleanup subscription on unmount
        return () => {
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [storeAuthState, clearStoredAuthState]);

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
        // Use backend authentication instead of Supabase
        const response = await api.post("/auth/login", {
          email,
          password,
        });

        if (response.data.status === "ok") {
          const userData = {
            id: response.data.user.id,
            email: response.data.user.email,
            role: response.data.user.role || "BASEUSER",
            ...response.data.user,
          };

          console.log("🔍 Login user data:", {
            user: response.data.user,
            assigned_role: userData.role,
            email: userData.email,
          });

          console.log("🔍 Role detection details:", {
            final_role: userData.role,
            is_super_admin: userData.role === "SUPER_ADMIN",
          });

          setUser(userData);
          setIsAuthenticated(true);

          // Store the JWT token from the response
          const token = response.data.accessToken;
          const refreshToken = response.data.refreshToken;
          if (token) {
            // Store token in localStorage as fallback
            localStorage.setItem("auth_token", token);
            // Also set as cookie for the request interceptor
            document.cookie = `access_token=${token}; path=/; max-age=${
              7 * 24 * 60 * 60
            }; SameSite=Lax; Secure=false`; // 7 days, allow cross-site
            console.log(
              "🔑 JWT token stored successfully:",
              token.substring(0, 20) + "..."
            );
            console.log("🍪 Cookie set:", document.cookie);
          }
          if (refreshToken) {
            // Store refresh token as cookie for token refresh
            document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${
              7 * 24 * 60 * 60
            }; SameSite=Lax; Secure=false`; // 7 days
            console.log("🔄 Refresh token stored successfully");
          }

          // Store auth state with backend JWT token
          storeAuthState(userData, token);
          console.log("✅ Backend login successful");
        } else {
          throw new Error("Login failed: No user data returned");
        }
      } catch (error) {
        console.error("Backend login error:", error);
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
