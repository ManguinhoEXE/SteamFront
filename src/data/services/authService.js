import api from '../api/axiosConfig';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async verify() {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  async uploadProfileImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/auth/upload-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProfileImage() {
    const response = await api.delete('/auth/profile-image');
    return response.data;
  },

  async getAllUsers() {
    const response = await api.get('/auth/users');
    return response.data;
  },
};
