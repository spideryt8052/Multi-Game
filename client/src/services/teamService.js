import api from './api';

export const teamService = {
  // Get teams
  getTeams: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.gameSlug) params.append('gameSlug', filters.gameSlug);
      if (filters.myTeams) params.append('myTeams', 'true');

      const res = await api.get(`/teams?${params.toString()}`);
      return res.data?.data || [];
    } catch (err) {
      console.warn('API /teams error:', err.message);
      return [];
    }
  },

  // Get single team
  getTeamById: async (id) => {
    const res = await api.get(`/teams/${id}`);
    return res.data?.data;
  },

  // Create team
  createTeam: async (teamData) => {
    const res = await api.post('/teams', teamData);
    return res.data;
  },

  // Update budget
  updateBudget: async (id, allocatedBudget) => {
    const res = await api.put(`/teams/${id}/budget`, { allocatedBudget });
    return res.data;
  },
};

export default teamService;

