import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await apiClient.post('/logout');
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
    return response.data;
  },
  
  getUser: async () => {
    const response = await apiClient.get('/user');
    return response.data;
  },
};

// Leads API
export const leadsAPI = {
  getAll: async (page = 1) => {
    const response = await apiClient.get(`/leads?page=${page}`);
    return response.data;
  },
  
  getOne: async (id: number) => {
    const response = await apiClient.get(`/leads/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await apiClient.post('/leads', data);
    return response.data;
  },
  
  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/leads/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await apiClient.delete(`/leads/${id}`);
    return response.data;
  },
};

// Complaints API
export const complaintsAPI = {
  getAll: async (page = 1) => {
    const response = await apiClient.get(`/complaints?page=${page}`);
    return response.data;
  },
  
  getOne: async (id: number) => {
    const response = await apiClient.get(`/complaints/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await apiClient.post('/complaints', data);
    return response.data;
  },
  
  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/complaints/${id}`, data);
    return response.data;
  },
  
  resolve: async (id: number, notes: string) => {
    const response = await apiClient.post(`/complaints/${id}/resolve`, { resolution_notes: notes });
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await apiClient.delete(`/complaints/${id}`);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard-stats');
    return response.data;
  },
};

export default apiClient;
