import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
console.log('API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request. use(
  (config) => {
    try {
      const userStr = localStorage.getItem('user');
      
      if (userStr) {
        const user = JSON.parse(userStr);
        
        if (user?. token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Room API
export const roomAPI = {
  getRooms: (params) => api.get('/rooms', { params }),
  getRoom: (id) => api.get(`/rooms/${id}`),
  createRoom: (roomData) => api.post('/rooms', roomData),
  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
};

// Booking API
export const bookingAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings/user'),
  getAllBookings: () => api.get('/bookings'),
  updateBooking: (id, status) => api.put(`/bookings/${id}`, { status }),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
};

export default api;