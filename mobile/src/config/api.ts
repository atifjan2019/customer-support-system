// API Configuration
// Change this to your production URL when deploying
export const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Physical device over USB (adb reverse tcp:8000 tcp:8000)
// export const API_BASE_URL = 'http://10.0.2.2:8000/api'; // Android emulator localhost
// export const API_BASE_URL = 'http://192.168.1.100:8000/api'; // Physical device over Wi-Fi

export const ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  USER: '/auth/me',
  LEADS: '/leads',
  COMPLAINTS: '/complaints',
  DASHBOARD: '/dashboard/stats',
};
