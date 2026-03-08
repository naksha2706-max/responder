import axios from 'axios';
import * as mockApi from './mockApi';

// API endpoint - will be set via environment variable
const API_BASE_URL = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:3000';
const USE_MOCK = true; // Set to false to use real backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Send a message to the AI First Responder
 * @param {string} message - The student's message
 * @param {string} sessionId - Optional session ID
 * @param {string} language - Language code ('en' or 'hi')
 * @returns {Promise} Response from the API
 */
export const sendMessage = async (message, language = 'en', sessionId = null, turnCount = 1) => {
  // Use mock API for local development
  if (USE_MOCK) {
    console.log('🔧 Using MOCK API (no backend configured)');
    return await mockApi.sendMessage(message, language, turnCount);
  }

  // Use real API when configured
  try {
    const response = await api.post('/message', {
      message,
      sessionId,
      language,
      turnCount,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error(
      error.response?.data?.error || 'Failed to send message. Please try again.'
    );
  }
};

/**
 * Get session details and message history
 * @param {string} sessionId - Session ID
 * @returns {Promise} Session data
 */
export const getSession = async (sessionId) => {
  try {
    const response = await api.get(`/session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting session:', error);
    throw new Error(
      error.response?.data?.error || 'Failed to retrieve session.'
    );
  }
};

/**
 * Delete a session and all associated data
 * @param {string} sessionId - Session ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteSession = async (sessionId) => {
  try {
    const response = await api.delete(`/session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting session:', error);
    throw new Error(
      error.response?.data?.error || 'Failed to delete session.'
    );
  }
};

/**
 * Check API health status
 * @returns {Promise} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw new Error('API is not responding.');
  }
};

export default api;
