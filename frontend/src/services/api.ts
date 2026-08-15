import axios from 'axios';
import { User, Item, Match, AdminStats, ReportSubmissionResult, MatchStatus } from '../types';

const API_URL = '/api/v1';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async register(data: any) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  async login(data: any) {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
  async getMe(): Promise<User> {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export const itemService = {
  async createLostItem(formData: FormData): Promise<ReportSubmissionResult> {
    const res = await api.post('/items/lost', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  async createFoundItem(formData: FormData): Promise<ReportSubmissionResult> {
    const res = await api.post('/items/found', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  async searchItems(params?: any): Promise<Item[]> {
    const res = await api.get('/items', { params });
    return res.data;
  },
  async getMyItems(): Promise<Item[]> {
    const res = await api.get('/items/my');
    return res.data;
  },
  async getItemById(id: number): Promise<Item> {
    const res = await api.get(`/items/${id}`);
    return res.data;
  }
};

export const matchService = {
  async getMatches(status?: MatchStatus): Promise<Match[]> {
    const res = await api.get('/matches', { params: { status_filter: status } });
    return res.data;
  },
  async getResolvedRetrievals(): Promise<Match[]> {
    const res = await api.get('/matches/resolved');
    return res.data;
  },
  async getMatchById(id: number): Promise<Match> {
    const res = await api.get(`/matches/${id}`);
    return res.data;
  },
  async confirmMatch(id: number): Promise<Match> {
    const res = await api.post(`/matches/${id}/confirm`);
    return res.data;
  },
  async resolveMatch(id: number): Promise<Match> {
    const res = await api.post(`/matches/${id}/resolve`);
    return res.data;
  },
  async rejectMatch(id: number): Promise<Match> {
    const res = await api.post(`/matches/${id}/reject`);
    return res.data;
  }
};

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  async getUsers(): Promise<User[]> {
    const res = await api.get('/admin/users');
    return res.data;
  },
  async getReports(): Promise<Item[]> {
    const res = await api.get('/admin/reports');
    return res.data;
  },
  async deleteReport(id: number): Promise<void> {
    await api.delete(`/admin/reports/${id}`);
  },
  async getMatches(): Promise<Match[]> {
    const res = await api.get('/admin/matches');
    return res.data;
  }
};
