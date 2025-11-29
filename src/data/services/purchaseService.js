import api from '../api/axiosConfig';

export const purchaseService = {
  // Crear compra desde propuesta (Solo Master)
  async createFromProposal(proposalId, data) {
    const response = await api.post(`/purchases/from-proposal/${proposalId}`, data);
    return response.data;
  },

  // Crear compra manual (Solo Master)
  async createManual(ownerId, data) {
    const response = await api.post(`/purchases/?owner_id=${ownerId}`, data);
    return response.data;
  },

  // Ver todas las compras
  async getAllPurchases() {
    const response = await api.get('/purchases/');
    return response.data;
  },

  // Ver compra específica
  async getPurchase(purchaseId) {
    const response = await api.get(`/purchases/${purchaseId}`);
    return response.data;
  },

  // Ver mis compras (como propietario)
  async getMyPurchases() {
    const response = await api.get('/purchases/my-purchases');
    return response.data;
  },

  // Ver mis participaciones
  async getMyParticipations() {
    const response = await api.get('/purchases/my-participations');
    return response.data;
  },
};
