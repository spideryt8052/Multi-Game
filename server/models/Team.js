import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide team name'],
      trim: true,
      unique: true,
    },
    tag: {
      type: String,
      required: [true, 'Please provide team tag'],
      trim: true,
      uppercase: true,
      maxlength: [6, 'Tag cannot exceed 6 characters'],
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop',
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    allocatedBudget: {
      type: Number,
      required: true,
      default: 50000,
    },
    remainingBudget: {
      type: Number,
      required: true,
      default: 50000,
    },
    roster: [
      {
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        inGameName: String,
        role: String,
        acquiredAtAuction: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Auction',
        },
        acquiredPrice: Number,
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model('Team', teamSchema);
export default Team;

