import { create } from 'zustand';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5000/api';
let socket;

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('fs5_user')) || null,
  isLoading: false,
  error: null,
  socketConnected: false,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      set({ user: response.data, isLoading: false });
      localStorage.setItem('fs5_user', JSON.stringify(response.data));
      get().connectSocket(response.data);
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      set({ user: response.data, isLoading: false });
      localStorage.setItem('fs5_user', JSON.stringify(response.data));
      get().connectSocket(response.data);
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('fs5_user');
    set({ user: null });
    get().disconnectSocket();
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const user = get().user;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.put(`${API_URL}/users/profile`, profileData, config);

      const updatedUser = { ...user, ...response.data };
      set({ user: updatedUser, isLoading: false });
      localStorage.setItem('fs5_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  connectSocket: (userData) => {
    if (!socket) {
      socket = io('http://localhost:5000');
      socket.emit('setup', userData);
      socket.on('connected', () => set({ socketConnected: true }));
    }
  },

  disconnectSocket: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      set({ socketConnected: false });
    }
  },

  getSocket: () => socket
}));

export default useAuthStore;
