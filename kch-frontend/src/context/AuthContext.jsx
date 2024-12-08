import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [userRole, setUserRole] = useState(() => {
    const savedRole = localStorage.getItem("userRole");
    return savedRole ? savedRole : null;
  });

  const [subscription, setSubscription] = useState(() => {
    const saveSubscription = localStorage.getItem("subscription");
    return saveSubscription ? saveSubscription : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("token", token);
      localStorage.setItem("subscription", user.subscription.tier);

      // Set Axios default Authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("token");
      localStorage.removeItem("subscription");

      // Remove Axios default Authorization header
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user, token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        if (token && user) {
          setUser(user);
          setUserRole(user.role);
          setToken(token);
          setSubscription(user.subscription.tier);
        } else {
          throw new Error("Login failed: Invalid response data.");
        }
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setToken(null);
    setSubscription(null);

    // Remove items from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("subscription");

    // Remove default authorization header from axios
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, userRole, token, login, logout, subscription }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
