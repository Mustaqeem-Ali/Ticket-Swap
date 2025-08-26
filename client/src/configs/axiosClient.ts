import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/'  ;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Use an interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    // 1. Get the token from localStorage
    const token = localStorage.getItem('ticketSwapToken');

    // 2. If the token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;