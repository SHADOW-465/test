/**
 * API service for communicating with the backend
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const recipeAPI = {
  // Get all recipes with pagination
  getRecipes: async (page = 1, limit = 10) => {
    const response = await api.get('/recipes', {
      params: { page, limit }
    });
    return response.data;
  },

  // Search recipes with filters
  searchRecipes: async (filters = {}, page = 1, limit = 10) => {
    const params = { page, limit, ...filters };
    const response = await api.get('/recipes/search', { params });
    return response.data;
  },

  // Get a specific recipe by ID
  getRecipeById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  // Get all available cuisines
  getCuisines: async () => {
    const response = await api.get('/recipes/cuisines/list');
    return response.data;
  }
};

export default api;
