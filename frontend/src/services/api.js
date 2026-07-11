import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized access
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear credentials and redirect or force reload
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-change'));
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username, password) => {
    // POST /public/login returns the JWT token directly in the body
    const response = await api.post('/public/login', { username, password });
    return response.data; // token string
  },
  signUp: async (username, password, email) => {
    // POST /public/sign-up
    await api.post('/public/sign-up', { username, password, email });
  },
};

export const journalAPI = {
  getAll: async () => {
    // GET /journal
    const response = await api.get('/journal');
    return response.data;
  },
  getById: async (id) => {
    // GET /journal/id/${id}
    const response = await api.get(`/journal/id/${id}`);
    return response.data;
  },
  create: async (title, content) => {
    // POST /journal
    const response = await api.post('/journal', { title, content });
    return response.data;
  },
  update: async (id, title, content) => {
    // PUT /journal/id/${id}
    const response = await api.put(`/journal/id/${id}`, { title, content });
    return response.data;
  },
  delete: async (id) => {
    // DELETE /journal/id/${id}
    await api.delete(`/journal/id/${id}`);
  },
};

export const userAPI = {
  getProfile: async (username) => {
    // GET /user/${username}
    const response = await api.get(`/user/${username}`);
    return response.data;
  },
  getWeather: async () => {
    // GET /user/weather
    const response = await api.get('/user/weather');
    return response.data; // returns plain greeting string
  },
  updateProfile: async (username, password) => {
    // PUT /user
    await api.put('/user', { username, password });
  },
  deleteAccount: async () => {
    // DELETE /user
    await api.delete('/user');
  },
};

export const adminAPI = {
  getAllUsers: async () => {
    // GET /admin/all-users
    const response = await api.get('/admin/all-users');
    return response.data;
  },
  createAdminUser: async (username, password) => {
    // POST /admin/create-admin-user
    await api.post('/admin/create-admin-user', { username, password });
  },
  clearCache: async () => {
    // GET /admin/clear-app-cache
    await api.get('/admin/clear-app-cache');
  },
};

export default api;
