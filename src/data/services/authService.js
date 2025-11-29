import api from '../api/axiosConfig';

export const authService = {
  // Registrar usuario
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Iniciar sesión
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Cerrar sesión
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Verificar autenticación
  async verify() {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  // Refrescar token
  async refreshToken() {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Subir imagen de perfil
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

  // Eliminar imagen de perfil
  async deleteProfileImage() {
    const response = await api.delete('/auth/profile-image');
    return response.data;
  },

  // Obtener todos los usuarios con balance
  async getAllUsers() {
    const response = await api.get('/auth/users');
    return response.data;
  },
};
