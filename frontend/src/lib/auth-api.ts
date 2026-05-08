import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create an axios instance that automatically sends cookies
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const authApi = {
  async register(data: any) {
    return api.post('/auth/register', data);
  },

  async login(formData: FormData) {
    return api.post('/auth/jwt/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  async logout() {
    return api.post('/auth/jwt/logout');
  },

  async me() {
    return api.get('/users/me'); // We can add this later in backend if needed
  },
};
