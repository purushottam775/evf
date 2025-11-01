import axios from 'axios';

// Normalize API URL to always end with /api
let API_URL = import.meta.env.VITE_API_URL || 'https://evb-1i4y.onrender.com/api';

// Ensure API_URL always ends with /api
if (!API_URL.endsWith('/api')) {
  // If it ends with just /, remove it and add /api
  if (API_URL.endsWith('/')) {
    API_URL = API_URL.slice(0, -1) + '/api';
  } else {
    // Otherwise append /api
    API_URL = API_URL + '/api';
  }
}

// Log for debugging (remove in production if needed)
if (import.meta.env.DEV) {
  console.log('API URL configured as:', API_URL);
}

// Export normalized API URL for use in other files
export const getApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'https://evb-1i4y.onrender.com/api';
  if (!url.endsWith('/api')) {
    if (url.endsWith('/')) {
      url = url.slice(0, -1) + '/api';
    } else {
      url = url + '/api';
    }
  }
  return url;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
