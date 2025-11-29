import api from '../api/axiosConfig';

export const proposalService = {
  // Crear propuesta
  async createProposal(data) {
    const response = await api.post('/proposals/', data);
    return response.data;
  },

  // Ver todas las propuestas
  async getAllProposals() {
    const response = await api.get('/proposals/');
    return response.data;
  },

  // Ver propuesta específica
  async getProposal(proposalId) {
    const response = await api.get(`/proposals/${proposalId}`);
    return response.data;
  },

  // Votar por propuesta
  async voteProposal(proposalId) {
    const response = await api.post(`/proposals/${proposalId}/vote`);
    return response.data;
  },

  // Ver mi voto actual
  async getMyVote() {
    const response = await api.get('/proposals/my-vote');
    return response.data;
  },

  // Seleccionar ganador (Solo Master)
  async selectWinner(proposalId) {
    const response = await api.post(`/proposals/${proposalId}/select-winner`);
    return response.data;
  },

  // Ver mis propuestas
  async getMyProposals() {
    const response = await api.get('/proposals/my-proposals');
    return response.data;
  },
};
