import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/api";

export { API_BASE_URL };

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const SignUp = async (username, email, password) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });
      const data = response.data;
      setLoading(false);
      return data;
    } catch (err) {
      console.error("SignUp error:", err);
      const msg = err.response?.data?.message || err.message || "Signup failed";
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }
  };

  const SignIn = async (email, password) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.post(`${API_BASE_URL}/api/auth/signin`, {
        email,
        password,
      });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem("token", receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("SignIn error:", err);
      const msg = err.response?.data?.message || err.message || "Sign in failed";
      setError(msg);
      setLoading(false);
      return false;
    }
  };

  const checkAuth = async () => {
    const authToken = localStorage.getItem("token");

    if (!authToken) {
      setToken("");
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/auth/verify-token`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.valid) {
        setToken(authToken);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      localStorage.removeItem("token");
      setToken("");
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    SignUp,
    loading,
    SignIn,
    setToken,
    token,
    user,
    setUser,
    error,
    setError,
    signOut,
    checkAuth,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
