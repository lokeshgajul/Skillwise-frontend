import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  const applyTheme = (currentTheme) => {
    if (currentTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.body.style.background = "#f8fafc";
      document.body.style.color = "#0f172a";
    } else {
      document.documentElement.classList.add("dark");
      document.body.style.background = "#18181b";
      document.body.style.color = "#f8fafc";
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
