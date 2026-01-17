/**
 * Konfigurasi API Dinamis
 * Mendeteksi secara otomatis antara lingkungan Lokal dan Production
 */

// 1. Logika Deteksi Lingkungan
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

// 2. Tentukan Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || (isLocalhost
  ? 'http://localhost:5000/api'
  : 'https://api.namadomainanda.com/api');

// 3. API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  ME: '/auth/me',

  // Users
  USERS: '/staff',

  // Menu
  MENU: '/menu',
  MENU_CATEGORIES: '/menu/categories',

  // Orders
  ORDERS: '/orders',
  ORDER_ITEMS: (orderId) => `/orders/${orderId}/items`,
  ORDER_STATUS: (orderId) => `/orders/${orderId}/status`,
  ORDER_ITEM_STATUS: (orderId, itemId) => `/orders/${orderId}/items/${itemId}/status`,

  // Payments
  PAYMENTS: '/payments',
  PAYMENT_PROCESS: '/payments',
  PAYMENT_WEBHOOK: '/payments/webhook',

  // Reports
  REPORTS_DAILY: '/owner/reports/sales', // Uses ?period=daily&start=YYYY-MM-DD
  REPORTS_RANGE: '/owner/reports/sales', // Uses ?period=custom&start=...&end=...
};

// 4. Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// 5. Token storage key
export const TOKEN_STORAGE_KEY = 'pos_so_token';

// 6. Helper Function (Opsional tapi sangat berguna)
// Fungsi ini membantu mengambil header yang sudah termasuk Token jika ada
export const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return {
    ...DEFAULT_HEADERS,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};