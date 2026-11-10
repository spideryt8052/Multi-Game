import mongoose from 'mongoose';
import { PARTICIPANT_STATUS } from '../utils/constants.js';

const auctionParticipantSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inGameName: {
      type: String,
      required: true,
      trim: true,
    },
    inGameId: {
      type: String,
      required: true,
      trim: true,
    },
    primaryRole: {
      type: String,
      required: true,
    },
    secondaryRole: {
      type: String,
    },
    stats: {
      kdRatio: { type: Number, default: 1.0 },
      matchesPlayed: { type: Number, default: 0 },
      winRate: { type: Number, default: 0 },
      tierRank: { type: String, default: 'Unranked' },
      esportsTrophies: [{ type: String }],
      // Physical Sports statistics
      runsScored: { type: Number, default: 0 },
      battingAverage: { type: Number, default: 0 },
      strikeRate: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      bowlingEconomy: { type: Number, default: 0 },
      goalsScored: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      raidPoints: { type: Number, default: 0 },
      tacklePoints: { type: Number, default: 0 },
      // Chess & Carrom statistics
      fideRating: { type: Number, default: 0 },
      blitzRating: { type: Number, default: 0 },
      whiteSlams: { type: Number, default: 0 },
      jerseyNumber: { type: Number },
    },
    photo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop',
    },
    basePrice: {
      type: Number,
      required: true,
      default: 2500,
    },
    soldPrice: {
      type: Number,
      default: null,
    },
    soldToTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(PARTICIPANT_STATUS),
      default: PARTICIPANT_STATUS.REGISTERED,
      index: true,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const AuctionParticipant = mongoose.model('AuctionParticipant', auctionParticipantSchema);
export default AuctionParticipant;

