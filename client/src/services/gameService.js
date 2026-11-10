import api from './api';
import { MOCK_GAMES } from '../utils/mockData';

export const gameService = {
  // Get all games with fallback to mock data
  getAllGames: async () => {
    try {
      const res = await api.get('/games');
      if (res.data?.success && res.data.data?.length > 0) {
        return res.data.data;
      }
      return MOCK_GAMES;
    } catch (err) {
      console.warn('API /games offline, loading default catalog:', err.message);
      return MOCK_GAMES;
    }
  },

  // Get single game by slug
  getGameBySlug: async (slug) => {
    try {
      const res = await api.get(`/games/${slug}`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
      const fallbackGame = MOCK_GAMES.find((g) => g.slug === slug) || MOCK_GAMES[0];
      return { game: fallbackGame, auctions: [] };
    } catch (err) {
      const fallbackGame = MOCK_GAMES.find((g) => g.slug === slug) || MOCK_GAMES[0];
      return { game: fallbackGame, auctions: [] };
    }
  },

  // Admin create game
  createGame: async (gameData) => {
    const res = await api.post('/games', gameData);
    return res.data;
  },

  // Admin update game
  updateGame: async (id, gameData) => {
    const res = await api.put(`/games/${id}`, gameData);
    return res.data;
  },

  // Admin delete game
  deleteGame: async (id) => {
    const res = await api.delete(`/games/${id}`);
    return res.data;
  },
};

export default gameService;

