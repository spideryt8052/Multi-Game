import mongoose from 'mongoose';

const auctionRuleSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
      unique: true,
    },
    maxRosterSize: {
      type: Number,
      default: 5,
    },
    minRosterSize: {
      type: Number,
      default: 4,
    },
    budgetLimit: {
      type: Number,
      default: 50000,
    },
    baseStartingPrice: {
      type: Number,
      default: 2500,
    },
    roleCaps: [
      {
        roleName: String,
        maxPerTeam: Number,
        minPerTeam: Number,
      },
    ],
    hammerTimeoutSeconds: {
      type: Number,
      default: 30,
    },
    antiSnipeExtensionSeconds: {
      type: Number,
      default: 15,
    },
  },
  {
    timestamps: true,
  }
);

const AuctionRule = mongoose.model('AuctionRule', auctionRuleSchema);
export default AuctionRule;

