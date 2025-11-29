import api from '../api/axiosConfig';

export const proposalService = {
  async createProposal(data) {
    const response = await api.post('/proposals/', data);
    return response.data;
  },

  async getAllProposals() {
    const response = await api.get('/proposals/');
    return response.data;
  },

  async getProposal(proposalId) {
    const response = await api.get(`/proposals/${proposalId}`);
    return response.data;
  },

  async voteProposal(proposalId) {
    const response = await api.post(`/proposals/${proposalId}/vote`);
    return response.data;
  },

  async getMyVote() {
    const response = await api.get('/proposals/my-vote');
    return response.data;
  },

  async selectWinner(proposalId) {
    const response = await api.post(`/proposals/${proposalId}/select-winner`);
    return response.data;
  },

  async getMyProposals() {
    const response = await api.get('/proposals/my-proposals');
    return response.data;
  },

  async getPropuestasTurn() {
    const response = await api.get('/proposals/turn-status');
    return response.data;
  },

  async togglePropuestasTurn() {
    const response = await api.post('/proposals/toggle-propuestas-turn');
    return response.data;
  },
};
