import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Roadmap & Progress API functions
export const roadmapService = {
  generateRoadmap: async (goal, experienceLevel = "Beginner") => {
    const response = await api.post("/api/roadmaps/generate-roadmap", {
      goal,
      experienceLevel,
    });
    return response.data;
  },

  getRoadmaps: async () => {
    const response = await api.get("/api/roadmaps/getRoadmaps");
    return response.data;
  },

  getRoadmapById: async (id) => {
    const response = await api.post("/api/roadmaps/getRoadmapById", { id });
    return response.data;
  },

  getActive: async () => {
    const response = await api.get("/api/roadmaps/active");
    return response.data;
  },

  completeTopic: async (roadmapId, topicId) => {
    const response = await api.post(
      `/api/roadmaps/${roadmapId}/topics/${topicId}/complete`
    );
    return response.data;
  },

  uncompleteTopic: async (roadmapId, topicId) => {
    const response = await api.post(
      `/api/roadmaps/${roadmapId}/topics/${topicId}/uncomplete`
    );
    return response.data;
  },

  completeResource: async (roadmapId, topicId, resourceId) => {
    const response = await api.post(
      `/api/roadmaps/${roadmapId}/topics/${topicId}/resources/${resourceId}/complete`
    );
    return response.data;
  },

  getAssessment: async (roadmapId) => {
    const response = await api.get(`/api/roadmaps/${roadmapId}/assessment`);
    return response.data;
  },

  submitAssessment: async (roadmapId, answers) => {
    const response = await api.post(
      `/api/roadmaps/${roadmapId}/assessment/submit`,
      { answers }
    );
    return response.data;
  },

  getAllResources: async () => {
    const response = await api.get("/api/roadmaps/resources");
    return response.data;
  },
};

// Assessment API functions (Initial diagnostic)
export const assessmentService = {
  generateQuestions: async (targetGoal, experienceLevel, claimedSkills) => {
    const response = await api.post("/api/assessment/generate-questions", {
      targetGoal,
      experienceLevel,
      claimedSkills,
    });
    return response.data;
  },

  evaluate: async (payload) => {
    const response = await api.post("/api/assessment/evaluate", payload);
    return response.data;
  },

  getLatest: async () => {
    const response = await api.get("/api/assessment/latest");
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get("/api/assessment/history");
    return response.data;
  },
};

// User Profile API functions
export const userService = {
  getProfile: async () => {
    const response = await api.get("/user-profile");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/user-profile", data);
    return response.data;
  },
};

// YouTube search API
export const youtubeService = {
  search: async (query) => {
    const response = await api.get("/api/youtube/search", {
      params: { query },
    });
    return response.data; // raw YouTube search items[]
  },
};

export default api;
