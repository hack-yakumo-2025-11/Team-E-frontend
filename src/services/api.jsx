import axios from 'axios';

// ✅ FIX: Use environment variable for production, localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const USER_ID = "1";

const api = axios.create({
  baseURL: API_BASE_URL + '/api', // Add /api here
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ FIX: Added for CORS
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Get all missions for selection
export const getMissions = () => {
  return api.get(`/missions/${USER_ID}`);
};

// Get specific mission by ID
export const getMissionById = (missionId) => {
  return api.get(`/missions/detail/${missionId}`);
};

// Select a mission
export const selectMission = (missionId) => {
  return api.post('/missions/select', {
    userId: USER_ID,
    missionId
  });
};

// Get location details by ID
export const getLocationById = (locationId) => {
  return api.get(`/locations/${locationId}`);
};

// Complete a task
export const completeTask = (missionId, taskId) => {
  return api.post('/tasks/complete', {
    userId: USER_ID,
    missionId,
    taskId
  });
};

// Swap mission (if not locked)
export const swapMission = (currentMissionId, newMissionId) => {
  return api.post('/missions/swap', {
    userId: USER_ID,
    currentMissionId,
    newMissionId
  });
};

// Reset all missions (new check-in)
export const resetMission = () => {
  return api.post('/missions/reset', {
    userId: USER_ID
  });
};

// Get user data
export const getUserData = () => {
  return api.get(`/${USER_ID}`);
};

// Get common achievements
export const getAchievements = () => {
  return api.get(`/achievements`);
};

export const getCurrentUserId = () => USER_ID;

export default api;