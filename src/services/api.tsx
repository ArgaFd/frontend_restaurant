import axios, { type AxiosResponse } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, TOKEN_STORAGE_KEY } from '../config/api';

// Type definitions
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  is_available: boolean;
}

export interface Order {
  id: number;
  tableNumber: number;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  menuId: number;
  quantity: number;
  unitPrice: number;
  totalPrice?: number; // Backend might not calculate this per item in schema, usually computed on fly or just unitPrice * quantity
}

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 1. Setup Instance Utama (Main API Client)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json", 'Accept': 'application/json' },
  withCredentials: true, // PENTING: Ini yang membuat browser otomatis kirim Cookie
  timeout: 15000,
});

// 2. Setup Instance Khusus File (Blob) - Exported for use in specific file upload/download services if needed
export const apiFileClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // PENTING
  responseType: "blob",
  timeout: 30000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }): Promise<AxiosResponse<ApiResponse<AuthResponse>>> => api.post(API_ENDPOINTS.LOGIN, credentials),
  getMe: (): Promise<AxiosResponse<ApiResponse<any>>> => api.get(API_ENDPOINTS.ME),
  forgotPassword: (email: string): Promise<AxiosResponse<ApiResponse<any>>> => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; password: string }): Promise<AxiosResponse<ApiResponse<any>>> => api.post('/auth/reset-password', data),
};

// User API
export const userAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<any[]>>> => api.get(API_ENDPOINTS.USERS),
  create: (userData: any): Promise<AxiosResponse<ApiResponse<any>>> => api.post(API_ENDPOINTS.USERS, userData),
  update: (id: number, userData: any): Promise<AxiosResponse<ApiResponse<any>>> => api.put(`${API_ENDPOINTS.USERS}/${id}`, userData),
  delete: (id: number): Promise<AxiosResponse<ApiResponse<any>>> => api.delete(`${API_ENDPOINTS.USERS}/${id}`),
};

// Menu API
export const menuAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<{ items: MenuItem[] }>>> => api.get(API_ENDPOINTS.MENU),
  getById: (id: number): Promise<AxiosResponse<ApiResponse<MenuItem>>> => api.get(`${API_ENDPOINTS.MENU}/${id}`),
  create: (menuData: Partial<MenuItem>): Promise<AxiosResponse<ApiResponse<MenuItem>>> => api.post(API_ENDPOINTS.MENU, menuData),
  update: (id: number, menuData: Partial<MenuItem>): Promise<AxiosResponse<ApiResponse<MenuItem>>> => api.put(`${API_ENDPOINTS.MENU}/${id}`, menuData),
  delete: (id: number): Promise<AxiosResponse<ApiResponse<any>>> => api.delete(`${API_ENDPOINTS.MENU}/${id}`),
  getCategories: (): Promise<AxiosResponse<ApiResponse<any[]>>> => api.get(API_ENDPOINTS.MENU_CATEGORIES),
  createCategory: (data: { name: string, subcategories?: string[], icon?: string }): Promise<AxiosResponse<ApiResponse<any>>> => api.post(API_ENDPOINTS.MENU_CATEGORIES, data),
  updateCategory: (id: string, data: { name?: string, subcategories?: string[], icon?: string }): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.put(`${API_ENDPOINTS.MENU_CATEGORIES}/${id}`, data),
  deleteCategory: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.delete(`${API_ENDPOINTS.MENU_CATEGORIES}/${id}`),
  addSubcategory: (categoryId: string, subcategory: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.post(`${API_ENDPOINTS.MENU_CATEGORIES}/${categoryId}/subcategories`, { subcategory }),
  removeSubcategory: (categoryId: string, subName: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.delete(`${API_ENDPOINTS.MENU_CATEGORIES}/${categoryId}/subcategories/${subName}`),
};

// Orders API
export const orderAPI = {
  getAll: (params = {}): Promise<AxiosResponse<ApiResponse<Order[]>>> => api.get(API_ENDPOINTS.ORDERS, { params }),
  getById: (id: number): Promise<AxiosResponse<ApiResponse<Order>>> => api.get(`${API_ENDPOINTS.ORDERS}/${id}`),
  create: (orderData: { tableNumber: number; customerName: string; items: { menuId: number; quantity: number }[] }): Promise<AxiosResponse<ApiResponse<Order>>> => api.post(API_ENDPOINTS.ORDERS, orderData),
  createGuest: (orderData: { tableNumber: number; customerName: string; items: { menuId: number; quantity: number }[] }): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.post(`${API_ENDPOINTS.ORDERS}/guest`, orderData),
  getGuestById: (id: number): Promise<AxiosResponse<ApiResponse<any>>> => api.get(`${API_ENDPOINTS.ORDERS}/guest/${id}`),
  updateStatus: (orderId: number, status: string): Promise<AxiosResponse<ApiResponse<Order>>> =>
    api.put(`${API_ENDPOINTS.ORDERS}/${orderId}/status`, { status }),
  getMyOrders: (): Promise<AxiosResponse<ApiResponse<Order[]>>> => api.get(`${API_ENDPOINTS.ORDERS}/my`),
};

// Payments API
export const paymentAPI = {
  create: (paymentData: { order_id: number; amount: number; payment_method: string }): Promise<AxiosResponse<ApiResponse<Payment>>> => api.post(API_ENDPOINTS.PAYMENTS, paymentData),
  getAll: (): Promise<AxiosResponse<ApiResponse<{ payments: Payment[]; totalItems: number; totalPages: number; currentPage: number }>>> => api.get(API_ENDPOINTS.PAYMENTS),
  getById: (id: number): Promise<AxiosResponse<ApiResponse<Payment>>> => api.get(`${API_ENDPOINTS.PAYMENTS}/${id}`),
  updateStatus: (id: number, status: string): Promise<AxiosResponse<ApiResponse<Payment>>> =>
    api.put(`${API_ENDPOINTS.PAYMENTS}/${id}/status`, { status }),
  guestDigital: (payload: { orderId: number; customer?: any }): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.post(`${API_ENDPOINTS.PAYMENTS}/guest/pay`, payload),
  guestManual: (payload: { orderId: number }): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.post(`${API_ENDPOINTS.PAYMENTS}/guest/manual`, payload),
};

// Reports API
export const reportAPI = {
  getDailyReport: (date: string, period = 'daily'): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get(API_ENDPOINTS.REPORTS_DAILY, { params: { period, start: date } }),
  getDateRangeReport: (startDate: string, endDate: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get(API_ENDPOINTS.REPORTS_RANGE, {
      params: { period: 'custom', start: startDate, end: endDate }
    }),
};

export default api;
