import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Hardcoded user ID (since you have user "1" in your backend)
const USER_ID = "1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method.toUpperCase()} ${config.url}`);
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

// Get all missions for the user
export const getMissions = () => {
  return api.get(`/missions/${USER_ID}`);
};

// Get specific mission by ID
export const getMissionById = (missionId) => {
  return api.get(`/missions/detail/${missionId}`);
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

// Reset mission (new check-in)
export const resetMission = (missionId) => {
  return api.post('/missions/reset', {
    userId: USER_ID,
    missionId
  });
};

// Get user achievements
export const getAchievements = () => {
  return api.get(`/achievements/${USER_ID}`);
};

// Export USER_ID for use in components if needed
export const getCurrentUserId = () => USER_ID;

export default api;