import mongoose from 'mongoose';
import { AUCTION_TYPES, AUCTION_STATUS, LOT_STATUS } from '../utils/constants.js';

const auctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide auction title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
      index: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    },
    auctionType: {
      type: String,
      enum: Object.values(AUCTION_TYPES),
      default: AUCTION_TYPES.PLAYER,
    },
    status: {
      type: String,
      enum: Object.values(AUCTION_STATUS),
      default: AUCTION_STATUS.UPCOMING,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
    },
    registrationDeadline: {
      type: Date,
    },
    startingBid: {
      type: Number,
      default: 2500,
      min: [0, 'Starting bid must be positive'],
    },
    minimumIncrement: {
      type: Number,
      default: 250,
      min: [1, 'Increment must be at least 1'],
    },
    maxTeams: {
      type: Number,
      default: 16,
    },
    maxParticipants: {
      type: Number,
      default: 64,
    },
    teamBudgetLimit: {
      type: Number,
      default: 50000,
    },
    entryFee: {
      type: Number,
      default: 2500,
    },
    prizePool: {
      total: { type: Number, default: 50000 },
      firstPlace: { type: Number, default: 30000 },
      secondPlace: { type: Number, default: 15000 },
      thirdPlace: { type: Number, default: 5000 },
      mvp: { type: Number, default: 2500 },
    },
    adminSlot: {
      tier: { type: String, default: 'Silver Slot (16 Teams)' },
      feePaid: { type: Number, default: 1999 },
      licenseNumber: { type: String, default: 'LIC-ADMIN-8492' },
      isApprovedByAdmin: { type: Boolean, default: true },
    },
    matchFormat: {
      type: String,
      default: 'Standard Competitive Format',
    },
    venueOrServer: {
      type: String,
      default: 'Main Tournament Arena',
    },
    externalRules: [
      {
        type: String,
      },
    ],
    currentLot: {
      participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuctionParticipant',
      },
      currentBid: {
        type: Number,
        default: 0,
      },
      currentBidderTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
      currentBidderUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      lotStartTime: {
        type: Date,
      },
      lotEndsAt: {
        type: Date,
      },
      lotTimerSeconds: {
        type: Number,
        default: 30,
      },
      lotStatus: {
        type: String,
        enum: Object.values(LOT_STATUS),
        default: LOT_STATUS.WAITING,
      },
    },
    ruleSet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AuctionRule',
    },
  },
  {
    timestamps: true,
  }
);

const Auction = mongoose.model('Auction', auctionSchema);
export default Auction;

