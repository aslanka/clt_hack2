// api/axiosInstance.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const backend_url = 'http://localhost:3000'; // Backend URL

const axiosInstance = axios.create({
  baseURL: 'http://10.106.15.82:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach the token
axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Alert.alert('Session Expired', 'Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
