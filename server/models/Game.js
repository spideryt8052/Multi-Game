import mongoose from 'mongoose';
import { AUCTION_TYPES } from '../utils/constants.js';

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide game title'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please provide game slug'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    developer: {
      type: String,
      required: [true, 'Please provide game publisher / developer'],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'Please provide genre'],
      trim: true,
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    },
    iconImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop',
    },
    description: {
      type: String,
      trim: true,
    },
    supportedAuctionTypes: [
      {
        type: String,
        enum: Object.values(AUCTION_TYPES),
        default: AUCTION_TYPES.PLAYER,
      },
    ],
    defaultRoles: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model('Game', gameSchema);
export default Game;

