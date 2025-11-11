import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMissions = (userId) => {
  return api.get(`/missions/${userId}`);
};

export const getMissionById = (missionId) => {
  return api.get(`/missions/detail/${missionId}`);
};

export const getLocationById = (locationId) => {
  return api.get(`/locations/${locationId}`);
};

export const completeTask = (taskData) => {
  return api.post('/tasks/complete', taskData);
};

export const getAchievements = (userId) => {
  return api.get(`/achievements/${userId}`);
};

export default api;
