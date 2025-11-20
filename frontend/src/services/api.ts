import axios from 'axios';
import { Expense, BudgetStatus } from '../types';

export const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export interface User {
  id: string;
  name: string;
  email: string;
  darkMode?: boolean;   // add this if using darkMode
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Add token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// attach token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== Auth =====
export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await API.post('/auth/login', { email, password });
  return res.data;
}

export async function register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await API.post('/auth/register', { name, email, password });
  return res.data;
}

// ===== Expenses =====
export const getExpenses = async (): Promise<Expense[]> => {
  const res = await API.get('/expenses');
  return res.data.data || res.data; // handle both {status,data} and raw arrays
};

export const createExpense = async (
  data: Omit<Expense, '_id' | 'createdAt' | 'updatedAt' | 'userId'>
) => {
  const res = await API.post('/expenses', data);
  return res.data;
};

export const updateExpense = async (id: string, data: Partial<Expense>) => {
  const res = await API.put(`/expenses/${id}`, data);
  return res.data;
};

export const deleteExpense = async (id: string) => {
  const res = await API.delete(`/expenses/${id}`);
  return res.data;
};

// ===== Budget =====
export const checkBudgetStatus = async (): Promise<BudgetStatus> => {
  const res = await API.get('/expenses/status/budget');
  // backend might return {status:'success', data: {...}} or data itself
  return res.data.data || res.data;
};

// ===== Analytics =====
export const getAnalytics = async () => {
  const res = await API.get('/analytics/spending');
  return res.data.data || res.data;
};

export const getCategoryBreakdown = async () => {
  const res = await API.get('/analytics/category-breakdown');
  return res.data.data || res.data;
};

export const getMonthlyTrends = async () => {
  const res = await API.get('/analytics/monthly-trends');
  return res.data.data || res.data;
};

export const getPredictiveAnalytics = async () => {
  const res = await API.get('/analytics/predictive');
  return res.data.data || res.data;
};