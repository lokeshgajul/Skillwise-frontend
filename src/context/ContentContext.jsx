import React from "react";
import { createContext, useState } from "react";

export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState("");
  const [goal, setGoal] = useState("");

  const generateRoadmap = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/generate-roadmap", {
        method: "POST",
        body: JSON.stringify({ goal }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setRoadmap(data.roadmap);
      setLoading(false);
      console.log("context ", goal);

      return true;
    } catch (error) {
      console.log(error);
      setLoading(false);
      return false;
    }
  };

  const value = {
    roadmap,
    loading,
    goal,
    setGoal,
    generateRoadmap,
  };

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};
