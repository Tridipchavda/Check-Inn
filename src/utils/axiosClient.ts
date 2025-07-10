import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api/graphql',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token to every request if available
axiosClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosClient;
