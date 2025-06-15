import React, { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  // const navigate = useNavigate();

  const SignUp = async (username, email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/signup", {
        username,
        email,
        password,
      });
      const user = await response.data.user;
      setLoading(false);
      console.log("user signup successfully ", user);
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const SignIn = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/signin", {
        email,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setToken(token);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  // const checkAuth = async () => {
  //   const authToken = localStorage.getItem("token");
  //   if (!authToken) {
  //     setError("Token is not present");
  //   }

  //   try {
  //     const response = await axios.get("http://localhost:3000/verify-token", {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //       },
  //     });
  //     if (response.data.valid) {
  //       setToken(authToken);
  //       // navigate("/");
  //       setIsAuthenticated(true);
  //     } else {
  //       localStorage.removeItem("token");
  //       // navigate("/signin");
  //       setIsAuthenticated(false);
  //     }
  //   } catch (error) {
  //     console.error("Token check failed", error);
  //     localStorage.removeItem("token");
  //     setIsAuthenticated(false);
  //     setError("");
  //     // navigate("/signin");
  //   }
  // };

  // useEffect(() => {
  //   checkAuth();
  // }, [token]);

  const value = {
    SignUp,
    loading,
    SignIn,
    setToken,
    token,
    // checkAuth,
    isAuthenticated,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
