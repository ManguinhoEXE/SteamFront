import api from '../api/axiosConfig';

export const purchaseService = {
  async createFromProposal(proposalId, data) {
    const response = await api.post(`/purchases/from-proposal/${proposalId}`, data);
    return response.data;
  },

  async createManual(ownerId, data) {
    const response = await api.post(`/purchases/?owner_id=${ownerId}`, data);
    return response.data;
  },

  async getAllPurchases() {
    const response = await api.get('/purchases/');
    return response.data;
  },

  async getPurchase(purchaseId) {
    const response = await api.get(`/purchases/${purchaseId}`);
    return response.data;
  },

  async getMyPurchases() {
    const response = await api.get('/purchases/my-purchases');
    return response.data;
  },

  async getMyParticipations() {
    const response = await api.get('/purchases/my-participations');
    return response.data;
  },
};
