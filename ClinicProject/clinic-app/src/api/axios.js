import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// ================================================
// IMPORTANT: Configure your backend URL here
// ================================================
// 
// CRITICAL: In Expo Go on a physical phone, "localhost" does NOT point to your PC.
// You must use your PC's local IPv4 address.
//
// For Android Emulator: http://10.0.2.2:5000/api
// For Physical Phone:   http://192.168.1.50:5000/api
//
// HOW TO FIND YOUR PC IP:
// Windows: Open Command Prompt and type:  ipconfig
//          Look for "IPv4 Address" (usually 192.168.x.x or 10.x.x.x)
//
// Example:  Replace with your actual IPv4 like 192.168.1.50
// Result:   http://192.168.1.50:5000/api
//
// Test with Postman:
// - POST http://192.168.1.50:5000/api/auth/register
// - Headers: Content-Type: application/json
// - Body: { "name": "Test", "email": "test@test.com", "password": "123456", "role": "patient" }
// ================================================

const getExpoHost = () => {
  const possibleHosts = [
    Constants.expoConfig?.hostUri,
    Constants.expoGoConfig?.debuggerHost,
    Constants.manifest2?.extra?.expoClient?.hostUri,
  ];

  const hostWithPort = possibleHosts.find((value) => typeof value === 'string' && value.length > 0);
  if (!hostWithPort) {
    return null;
  }

  return hostWithPort.split(':')[0];
};

const backendHostFromEnv = process.env.EXPO_PUBLIC_API_HOST?.trim();
const backendUrlFromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
const fallbackHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

const BACKEND_URL =
  backendUrlFromEnv ||
  `http://${backendHostFromEnv || getExpoHost() || fallbackHost}:5000/api`;

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log the configured backend URL (useful for debugging)
console.log('Backend URL configured:', BACKEND_URL);

// Interceptor to add token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      
      // Add token to Authorization header if it exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect handled by AuthContext
      try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
      } catch (e) {
        console.error('Error clearing storage:', e);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;



