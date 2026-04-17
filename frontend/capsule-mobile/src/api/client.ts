import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with your computer's local IP address (e.g., 'http://192.168.1.X:8000')
// 'localhost' will NOT work on an Android emulator connecting to Docker.
const API_URL = 'http://YOUR_LOCAL_IP:8000'; 

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject the JWT token into every request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);