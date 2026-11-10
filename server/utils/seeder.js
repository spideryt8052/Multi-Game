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

    const cricketOwnerUser = await User.create({
      fullName: 'Vikramaditya Singhania',
      username: 'mumbai_titans_owner',
      email: 'owner@mumbaititans.com',
      mobileNumber: '+919888888888',
      password: 'Owner@123',
      role: ROLES.TEAM_OWNER,
      country: 'India',
      gamingExperience: 'Intermediate',
      inGameId: 'TitansBoss',
    });

    const athleteUser = await User.create({
      fullName: 'Rohit Sharma (Club All-Rounder)',
      username: 'rohit_cricketer',
      email: 'rohit@cricket.in',
      mobileNumber: '+919777777777',
      password: 'Gamer@123',
      role: ROLES.GAMER,
      country: 'India',
      gamingExperience: 'Professional Esports',
      inGameId: 'Jersey #45',
    });

    console.log(' Created test users (Admin, Franchise Owner, Athlete).');

    // 2. Create Games & Physical Sports
    const games = await Game.insertMany([
      // Esports
      {
        title: 'BGMI',
        slug: 'bgmi',
        categoryType: 'esports',
        developer: 'Krafton',
        genre: 'Battle Royale',
        bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
        description: 'Battlegrounds Mobile India official competitive roster drafts and squad player bidding.',
        defaultRoles: ['IGL', 'Assaulter', 'Support', 'Sniper / DMR'],
      },
      {
        title: 'Valorant',
        slug: 'valorant',
        categoryType: 'esports',
        developer: 'Riot Games',
        genre: 'Tactical FPS',
        bannerImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop',
        description: 'Tactical hero-shooter player auctions featuring role caps: Duelist, Initiator, Controller, and Sentinel.',
        defaultRoles: ['Duelist', 'Initiator', 'Controller', 'Sentinel'],
      },
      {
        title: 'Free Fire MAX',
        slug: 'freefire',
        categoryType: 'esports',
        developer: 'Garena',
        genre: 'Mobile Battle Royale',
        bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
        description: 'Fast-paced mobile esports player drafts and clan budget auctions.',
        defaultRoles: ['Rusher', 'Sniper', 'Granadier', 'Captain'],
      },

      // Physical Sports
      {
        title: 'Cricket (IPL & Box Cricket)',
        slug: 'cricket',
        categoryType: 'physical_sports',
        developer: 'BCCI / Premier Associations',
        genre: 'Physical Sport',
        bannerImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
        description: 'Premier Cricket tournament live auctions: Batsmen, Pace Bowlers, Spinners, All-Rounders, and Wicketkeepers.',
        defaultRoles: ['Opening Batsman', 'Top Order Batsman', 'Hard-Hitting All-Rounder', 'Pace Bowler', 'Spin Bowler', 'Wicketkeeper Batsman'],
      },
      {
        title: 'Football / Turf Soccer',
        slug: 'football',
        categoryType: 'physical_sports',
        developer: 'Turf & Club Associations',
        genre: 'Physical Sport',
        bannerImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop',
        description: '5-a-side Turf Soccer and 11-a-side Football League player drafts.',
        defaultRoles: ['Striker', 'Winger', 'Central Midfielder', 'Defender', 'Goalkeeper'],
      },
      {
        title: 'Kabaddi Pro League',
        slug: 'kabaddi',
        categoryType: 'physical_sports',
        developer: 'State & National Kabaddi Federations',
        genre: 'Physical Sport',
        bannerImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1200&auto=format&fit=crop',
        description: 'High-intensity contact sports player draft: Main Raiders and Corner Defenders.',
        defaultRoles: ['Main Raider', 'Right Corner Defender', 'Left Corner Defender', 'All-Rounder'],
      },
      {
        title: 'Chess (Global League & Blitz)',
        slug: 'chess',
        categoryType: 'physical_sports',
        developer: 'FIDE / Global Chess League',
        genre: 'Mind & Board Sport',
        bannerImage: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1200&auto=format&fit=crop',
        description: 'High-stakes chess franchise drafts: Grandmasters (Board 1), Rapid & Blitz Specialists.',
        defaultRoles: ['Grandmaster (Board 1)', 'International Master (Board 2)', 'Rapid / Blitz Specialist', 'Junior Prodigy'],
      },
      {
        title: 'Carrom (National Championship)',
        slug: 'carrom',
        categoryType: 'physical_sports',
        developer: 'All India Carrom Federation',
        genre: 'Tabletop Sport',
        bannerImage: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=1200&auto=format&fit=crop',
        description: 'National carrom championship drafts: White Slam masters, Direct Strikers, and Cut & Pocket specialists.',
        defaultRoles: ['White Slam Specialist', 'Direct Striker', 'Cut & Pocket Master', 'Doubles Partner'],
      },
    ]);

    const cricketGame = games.find((g) => g.slug === 'cricket');
    const bgmiGame = games.find((g) => g.slug === 'bgmi');

    console.log(` Created ${games.length} titles (Both Esports & Physical Sports).`);

    // 3. Create Teams
    const titansTeam = await Team.create({
      name: 'Mumbai Titans',
      tag: 'MT',
      game: cricketGame._id,
      owner: cricketOwnerUser._id,
      description: 'Premier Box Cricket & Turf franchise with championship history.',
      allocatedBudget: 100000,
      remainingBudget: 67500,
    });

    const warriorsTeam = await Team.create({
      name: 'Andheri Warriors',
      tag: 'AW',
      game: cricketGame._id,
      owner: cricketOwnerUser._id,
      description: 'Challenger cricket team known for aggressive top-order batting.',
      allocatedBudget: 100000,
      remainingBudget: 80000,
    });

    console.log(' Created physical sports teams.');

    // 4. Create Cricket Mega Auction (Live)
    const cricketAuction = await Auction.create({
      title: 'Mumbai Premier Box Cricket League 2026 - Season 4 Auction',
      game: cricketGame._id,
      organizer: adminUser._id,
      bannerImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop',
      status: AUCTION_STATUS.LIVE,
      auctionType: 'player',
      startTime: new Date(),
      startingBid: 5000,
      minimumIncrement: 500,
      maxTeams: 8,
      maxParticipants: 72,
      teamBudgetLimit: 100000,
      currentLot: {
        currentBid: 32500,
        currentBidderTeam: titansTeam._id,
        currentBidderUser: cricketOwnerUser._id,
        lotTimerSeconds: 25,
        lotStatus: LOT_STATUS.BIDDING,
      },
    });

    // 5. Create Athlete Lot
    const participant = await AuctionParticipant.create({
      auction: cricketAuction._id,
      user: athleteUser._id,
      inGameName: 'Rohit_Verma',
      inGameId: 'Jersey #45',
      primaryRole: 'All-Rounder (Right-Hand Bat / Fast Medium)',
      stats: {
        runsScored: 1240,
        strikeRate: 168.4,
        wickets: 42,
        bowlingEconomy: 6.8,
        matchesPlayed: 56,
        tierRank: 'Ranji / Club A-Division',
        esportsTrophies: ['Best All-Rounder 2024', 'Man of the Series - Corporate Cup'],
      },
      basePrice: 10000,
      status: PARTICIPANT_STATUS.ACTIVE_LOT,
      orderIndex: 1,
    });

    cricketAuction.currentLot.participant = participant._id;
    await cricketAuction.save();

    console.log(' Seeded Cricket Mega Auction with live player lot.');
    console.log('\n Database Seeding with Physical Sports & Esports Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding Failed:', error);
    process.exit(1);
  }
};

seedData();
