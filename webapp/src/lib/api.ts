import axios from 'axios';
import type { AuthResponse, AnalyzeRequest, AnalyzeResponse, SearchHistory } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  async register(email: string, password: string, username: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', {
      email,
      password,
      username,
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async getCurrentUser(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>('/api/auth/me');
    return response.data;
  },
};

export const analyzeApi = {
  async analyzeProducts(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    const response = await api.post<AnalyzeResponse>('/api/analyze', request);
    return response.data;
  },

  async getHistory(): Promise<SearchHistory[]> {
    const response = await api.get<SearchHistory[]>('/api/history');
    return response.data;
  },

  async saveHistory(history: Omit<SearchHistory, 'id'>): Promise<void> {
    await api.post('/api/history', history);
  },
};

export default api;
