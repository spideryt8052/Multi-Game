import api from './api';
import { MOCK_AUCTIONS } from '../utils/mockData';

export const auctionService = {
  // Get all auctions with filters
  getAuctions: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.gameSlug) params.append('gameSlug', filters.gameSlug);
      if (filters.type) params.append('type', filters.type);

      const res = await api.get(`/auctions?${params.toString()}`);
      if (res.data?.success && res.data.data?.length > 0) {
        return res.data.data;
      }

      // Filter mock data if API is empty or offline
      let filtered = [...MOCK_AUCTIONS];
      if (filters.status) {
        filtered = filtered.filter((a) => a.status === filters.status);
      }
      if (filters.gameSlug) {
        filtered = filtered.filter((a) => a.gameSlug === filters.gameSlug);
      }
      return filtered;
    } catch (err) {
      console.warn('API /auctions offline, using mock auction data:', err.message);
      let filtered = [...MOCK_AUCTIONS];
      if (filters.status) {
        filtered = filtered.filter((a) => a.status === filters.status);
      }
      if (filters.gameSlug) {
        filtered = filtered.filter((a) => a.gameSlug === filters.gameSlug);
      }
      return filtered;
    }
  },

  // Get single auction
  getAuctionById: async (id) => {
    try {
      const res = await api.get(`/auctions/${id}`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
      const fallback = MOCK_AUCTIONS.find((a) => a._id === id || a.gameSlug === id) || MOCK_AUCTIONS[0];
      return { auction: fallback, participants: [], recentBids: fallback.biddingHistory || [] };
    } catch (err) {
      const fallback = MOCK_AUCTIONS.find((a) => a._id === id || a.gameSlug === id) || MOCK_AUCTIONS[0];
      return { auction: fallback, participants: [], recentBids: fallback.biddingHistory || [] };
    }
  },

  // Create auction
  createAuction: async (auctionData) => {
    const res = await api.post('/auctions', auctionData);
    return res.data;
  },

  // Register participant
  registerParticipant: async (auctionId, participantData) => {
    const res = await api.post(`/auctions/${auctionId}/register`, participantData);
    return res.data;
  },

  // Update auction status
  updateStatus: async (auctionId, status) => {
    const res = await api.put(`/auctions/${auctionId}/status`, { status });
    return res.data;
  },
};

export default auctionService;

