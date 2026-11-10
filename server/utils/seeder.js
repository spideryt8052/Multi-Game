import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Game from '../models/Game.js';
import Auction from '../models/Auction.js';
import AuctionParticipant from '../models/AuctionParticipant.js';
import Team from '../models/Team.js';
import AuctionRule from '../models/AuctionRule.js';
import { ROLES, AUCTION_STATUS, LOT_STATUS, PARTICIPANT_STATUS } from './constants.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/multi-game-auction';
    await mongoose.connect(mongoUri);
    console.log(' Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Game.deleteMany(),
      Auction.deleteMany(),
      AuctionParticipant.deleteMany(),
      Team.deleteMany(),
      AuctionRule.deleteMany(),
    ]);
    console.log(' Cleared previous database records.');

    // 1. Create Core Users
    const adminUser = await User.create({
      fullName: 'Head Administrator',
      username: 'arena_admin',
      email: 'admin@arenaauctions.gg',
      mobileNumber: '+919999999999',
      password: 'Admin@123',
      role: ROLES.ADMIN,
      country: 'India',
      gamingExperience: 'Professional Esports',
      inGameId: 'Admin#0001',
    });

    const teamOwnerUser = await User.create({
      fullName: 'Chetan Chandgude',
      username: 'kronten_godl',
      email: 'owner@godl.gg',
      mobileNumber: '+919888888888',
      password: 'Owner@123',
      role: ROLES.TEAM_OWNER,
      country: 'India',
      gamingExperience: 'Professional Esports',
      inGameId: 'Kronten#GODL',
    });

    const athleteUser = await User.create({
      fullName: 'Akshat Goel',
      username: 'soul_akshat',
      email: 'akshat@soul.gg',
      mobileNumber: '+919777777777',
      password: 'Gamer@123',
      role: ROLES.GAMER,
      country: 'India',
      gamingExperience: 'Professional Esports',
      inGameId: '5129481920',
    });

    console.log(' Created test users (Admin, Team Owner, Athlete).');

    // 2. Create Games
    const games = await Game.insertMany([
      {
        title: 'BGMI',
        slug: 'bgmi',
        developer: 'Krafton',
        genre: 'Battle Royale',
        bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
        description: 'Battlegrounds Mobile India official competitive roster drafts and squad player bidding.',
        defaultRoles: ['IGL', 'Assaulter', 'Support', 'Sniper / DMR'],
      },
      {
        title: 'Valorant',
        slug: 'valorant',
        developer: 'Riot Games',
        genre: 'Tactical FPS',
        bannerImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop',
        description: 'Tactical hero-shooter player auctions featuring role caps: Duelist, Initiator, Controller, and Sentinel.',
        defaultRoles: ['Duelist', 'Initiator', 'Controller', 'Sentinel'],
      },
      {
        title: 'Free Fire MAX',
        slug: 'freefire',
        developer: 'Garena',
        genre: 'Mobile Battle Royale',
        bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
        description: 'Fast-paced mobile esports player drafts, rusher auctions, and clan budget auctions.',
        defaultRoles: ['Rusher', 'Sniper', 'Granadier', 'Captain'],
      },
      {
        title: 'Counter-Strike 2',
        slug: 'cs2',
        developer: 'Valve',
        genre: 'Tactical FPS',
        bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
        description: 'Classic competitive PC esports auctions featuring AWPers and Entry Fraggers.',
        defaultRoles: ['AWPer', 'Entry Fragger', 'IGL', 'Support'],
      },
      {
        title: 'FIFA / EA Sports FC',
        slug: 'fifa',
        developer: 'EA Sports',
        genre: 'Sports Simulation',
        bannerImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
        description: 'Pro gamer draft and club roster live auctions with player contracts.',
        defaultRoles: ['Pro Competitor', 'Tactical Analyst'],
      },
    ]);

    const bgmiGame = games[0];
    const valGame = games[1];

    console.log(` Created ${games.length} esports titles.`);

    // 3. Create Teams
    const godlTeam = await Team.create({
      name: 'GodLike Esports',
      tag: 'GODL',
      game: bgmiGame._id,
      owner: teamOwnerUser._id,
      description: 'Premier Indian esports organization competing in Tier 1 championships.',
      allocatedBudget: 50000,
      remainingBudget: 38500,
    });

    const soulTeam = await Team.create({
      name: 'Team Soul',
      tag: 'SOUL',
      game: bgmiGame._id,
      owner: teamOwnerUser._id,
      description: 'Fan favorite champions of BMPS and PMCO.',
      allocatedBudget: 50000,
      remainingBudget: 42000,
    });

    console.log(' Created competitive teams.');

    // 4. Create Auction
    const bgmiAuction = await Auction.create({
      title: 'BGMI Champions Cup Season 5 Player Auction',
      game: bgmiGame._id,
      organizer: adminUser._id,
      bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
      status: AUCTION_STATUS.LIVE,
      auctionType: 'player',
      startTime: new Date(),
      startingBid: 2500,
      minimumIncrement: 250,
      maxTeams: 16,
      maxParticipants: 48,
      teamBudgetLimit: 50000,
      currentLot: {
        currentBid: 14500,
        currentBidderTeam: godlTeam._id,
        currentBidderUser: teamOwnerUser._id,
        lotTimerSeconds: 25,
        lotStatus: LOT_STATUS.BIDDING,
      },
    });

    // 5. Create Lot Participant
    const participant = await AuctionParticipant.create({
      auction: bgmiAuction._id,
      user: athleteUser._id,
      inGameName: 'Soul_Akshat',
      inGameId: '5129481920',
      primaryRole: 'Assaulter / Finisher',
      stats: {
        kdRatio: 4.82,
        matchesPlayed: 450,
        winRate: 38.5,
        tierRank: 'Conqueror Top 100',
        esportsTrophies: ['BMPS 2023 Champion', 'BGIS Runner-up'],
      },
      basePrice: 5000,
      status: PARTICIPANT_STATUS.ACTIVE_LOT,
      orderIndex: 1,
    });

    // Link participant to auction
    bgmiAuction.currentLot.participant = participant._id;
    await bgmiAuction.save();

    console.log(' Seeded live auction room and active athlete lot.');
    console.log('\n Database Seeding Completed Successfully! You can now start the server and client.');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding Failed:', error);
    process.exit(1);
  }
};

seedData();

