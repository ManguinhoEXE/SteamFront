import api from '../api/axiosConfig';

export const depositService = {
  // Crear depósito (Solo Master)
  async createDeposit(data) {
    const response = await api.post('/deposits/', data);
    return response.data;
  },

  // Ver depósitos de un usuario
  async getUserDeposits(userId) {
    const response = await api.get(`/deposits/user/${userId}`);
    return response.data;
  },

  // Ver todos los depósitos (Solo Master)
  async getAllDeposits() {
    const response = await api.get('/deposits/');
    return response.data;
  },

  // Ver saldo de un usuario
  async getUserBalance(userId) {
    const response = await api.get(`/deposits/balance/${userId}`);
    return response.data;
  },

  // Ver saldos de todos los usuarios
  async getAllBalances() {
    const response = await api.get('/deposits/balances/all');
    return response.data;
  },
};
