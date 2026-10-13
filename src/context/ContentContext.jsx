import React, { createContext, useState } from "react";
import { roadmapService } from "../services/api";

export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState("");
  const [prevRoadmaps, setPrevRoadmaps] = useState([]);
  const [goal, setGoal] = useState("");
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [activeRoadmap, setActiveRoadmap] = useState(null);

  const generateRoadmap = async (customGoal, experienceLevel = "Beginner") => {
    const target = (customGoal || goal || "").trim();
    if (!target) return null;

    try {
      setLoading(true);
      const data = await roadmapService.generateRoadmap(target, experienceLevel);
      setRoadmap(data.roadmap || "");
      if (data.roadmapDoc) {
        setSelectedRoadmap(data.roadmapDoc);
        setActiveRoadmap(data.roadmapDoc);
      }
      await getRoadmaps();
      setLoading(false);
      return data.roadmapDoc || true;
    } catch (error) {
      console.error("Error generating roadmap:", error);
      setLoading(false);
      return null;
    }
  };

  const getRoadmaps = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const data = await roadmapService.getRoadmaps();
      if (data?.roadmaps) {
        setPrevRoadmaps(data.roadmaps);
      }
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
    }
  };

  const getRoadmapById = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await roadmapService.getRoadmapById(id);
      if (data?.roadmap) {
        setSelectedRoadmap(data.roadmap);
        setCurrentTopic(data.currentTopic || null);
      }
      setLoading(false);
      return data?.roadmap;
    } catch (error) {
      console.error("Error fetching roadmap by ID:", error);
      setLoading(false);
      return null;
    }
  };

  const fetchActiveRoadmap = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const data = await roadmapService.getActive();
      if (data?.activeRoadmap) {
        setActiveRoadmap(data.activeRoadmap);
      }
    } catch (error) {
      console.error("Error fetching active roadmap:", error);
    }
  };

  const markTopicComplete = async (roadmapId, topicId) => {
    try {
      const data = await roadmapService.completeTopic(roadmapId, topicId);
      if (data?.roadmap) {
        setSelectedRoadmap(data.roadmap);
        if (data.nextTopic) {
          setCurrentTopic(data.nextTopic);
        }
        // Update list in background
        getRoadmaps();
      }
      return data;
    } catch (error) {
      console.error("Error marking topic complete:", error);
      throw error;
    }
  };

  const markTopicIncomplete = async (roadmapId, topicId) => {
    try {
      const data = await roadmapService.uncompleteTopic(roadmapId, topicId);
      if (data?.roadmap) {
        setSelectedRoadmap(data.roadmap);
        getRoadmaps();
      }
      return data;
    } catch (error) {
      console.error("Error uncompleting topic:", error);
      throw error;
    }
  };

  const value = {
    roadmap,
    loading,
    goal,
    setGoal,
    setRoadmap,
    generateRoadmap,
    getRoadmaps,
    prevRoadmaps,
    getRoadmapById,
    selectedRoadmap,
    setSelectedRoadmap,
    currentTopic,
    setCurrentTopic,
    activeRoadmap,
    fetchActiveRoadmap,
    markTopicComplete,
    markTopicIncomplete,
  };

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};
