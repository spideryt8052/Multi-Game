import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ROLES } from '../utils/constants.js';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your full legal name'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Please provide your mobile number'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.GAMER,
    },
    country: {
      type: String,
      default: 'India',
      trim: true,
    },
    gamingExperience: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Semi-Pro', 'Professional Esports'],
      default: 'Intermediate',
    },
    favoriteGames: [
      {
        type: String,
        trim: true,
      },
    ],
    inGameId: {
      type: String,
      required: [true, 'Please provide in-game username or UID'],
      trim: true,
    },
    playerProfile: {
      sportSlug: { type: String, default: 'cricket' },
      primaryRole: { type: String },
      subRole: { type: String },
      battingStyle: { type: String },
      bowlingStyle: { type: String },
      preferredFoot: { type: String },
      device: { type: String },
      controlSetup: { type: String },
      rankTier: { type: String },
      signatureAgents: [{ type: String }],
      playerCategory: { type: String },
      expectedBasePrice: { type: Number, default: 5000 },
      jerseyNumber: { type: Number },
      accolades: { type: String },
      stats: {
        matchesPlayed: { type: Number, default: 0 },
        runsScored: { type: Number, default: 0 },
        battingAverage: { type: Number, default: 0 },
        strikeRate: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        bowlingEconomy: { type: Number, default: 0 },
        kdRatio: { type: Number, default: 1.0 },
        avgDamage: { type: Number, default: 0 },
        winRate: { type: Number, default: 0 },
        fideRating: { type: Number, default: 0 },
        goalsScored: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        raidPoints: { type: Number, default: 0 },
        tacklePoints: { type: Number, default: 0 },
      },
    },
    profilePicture: {
      type: String,
      default: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop',
    },
    isEmailVerified: {
      type: Boolean,
      default: true, // Auto-verified for seamless development
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, username: this.username },
    process.env.JWT_SECRET || 'arena_auctions_jwt_secret_production_ready_9921_key',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

const User = mongoose.model('User', userSchema);
export default User;

