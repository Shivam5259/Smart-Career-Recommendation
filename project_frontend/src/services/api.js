import axios from 'axios';

/**
 * We use a library called 'axios' to talk to our backend server.
 * Instead of typing the full URL every time, we create this 'api' object
 * with a base URL.
 */
const api = axios.create({
  // All our requests will start with '/api'
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * This is an "Interceptor". Think of it as a middleman.
 * Every time we send a request (like getting data), this code runs first.
 * It automatically grabs our security token (if we have one) and attaches it
 * to the request so the server knows who we are.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

