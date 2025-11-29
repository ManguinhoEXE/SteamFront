import api from '../api/axiosConfig';

export const depositService = {
  async createDeposit(data) {
    const response = await api.post('/deposits/', data);
    return response.data;
  },

  async getUserDeposits(userId) {
    const response = await api.get(`/deposits/user/${userId}`);
    return response.data;
  },

  async getAllDeposits() {
    const response = await api.get('/deposits/');
    return response.data;
  },

  async getUserBalance(userId) {
    const response = await api.get(`/deposits/balance/${userId}`);
    return response.data;
  },

  async getAllBalances() {
    const response = await api.get('/deposits/balances/all');
    return response.data;
  },
};
