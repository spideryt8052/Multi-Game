import Auction from '../models/Auction.js';
import AuctionParticipant from '../models/AuctionParticipant.js';
import Bid from '../models/Bid.js';
import Game from '../models/Game.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { AUCTION_STATUS, PARTICIPANT_STATUS } from '../utils/constants.js';

// @desc    Get all auctions with optional filters
// @route   GET /api/auctions
// @access  Public
export const getAuctions = async (req, res, next) => {
  try {
    const { status, gameSlug, type } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }
    if (type) {
      query.auctionType = type;
    }

    if (gameSlug) {
      const game = await Game.findOne({ slug: gameSlug.toLowerCase() });
      if (game) {
        query.game = game._id;
      }
    }

    const auctions = await Auction.find(query)
      .populate('game', 'title slug genre iconImage bannerImage')
      .populate('organizer', 'username fullName')
      .populate('currentLot.participant')
      .populate('currentLot.currentBidderTeam', 'name tag')
      .sort({ startTime: 1 });

    return successResponse(res, 'Auctions retrieved', auctions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single auction by ID with participants & bids
// @route   GET /api/auctions/:id
// @access  Public
export const getAuctionById = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('game')
      .populate('organizer', 'username fullName')
      .populate('currentLot.participant')
      .populate('currentLot.currentBidderTeam')
      .populate('ruleSet');

    if (!auction) {
      return errorResponse(res, 'Auction not found', 404);
    }

    const participants = await AuctionParticipant.find({ auction: auction._id })
      .populate('user', 'username fullName inGameId')
      .populate('soldToTeam', 'name tag')
      .sort({ orderIndex: 1 });

    const recentBids = await Bid.find({ auction: auction._id })
      .populate('team', 'name tag')
      .populate('bidder', 'username')
      .sort({ createdAt: -1 })
      .limit(30);

    return successResponse(res, 'Auction details retrieved', {
      auction,
      participants,
      recentBids,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new auction
// @route   POST /api/auctions
// @access  Private (Admin / Organizer)
export const createAuction = async (req, res, next) => {
  try {
    const {
      title,
      gameId,
      bannerImage,
      auctionType,
      startTime,
      registrationDeadline,
      startingBid,
      minimumIncrement,
      maxTeams,
      maxParticipants,
      teamBudgetLimit,
    } = req.body;

    const auction = await Auction.create({
      title,
      game: gameId,
      organizer: req.user._id,
      bannerImage,
      auctionType: auctionType || 'player',
      startTime,
      registrationDeadline,
      startingBid: startingBid || 2500,
      minimumIncrement: minimumIncrement || 250,
      maxTeams: maxTeams || 16,
      maxParticipants: maxParticipants || 64,
      teamBudgetLimit: teamBudgetLimit || 50000,
    });

    return successResponse(res, 'Auction created successfully', auction, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Register athlete / participant for auction
// @route   POST /api/auctions/:id/register
// @access  Private (Gamer)
export const registerParticipant = async (req, res, next) => {
  try {
    const { inGameName, inGameId, primaryRole, secondaryRole, stats, basePrice } = req.body;

    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return errorResponse(res, 'Auction not found', 404);
    }

    // Check duplicate
    const existing = await AuctionParticipant.findOne({
      auction: auction._id,
      user: req.user._id,
    });

    if (existing) {
      return errorResponse(res, 'You are already registered for this auction', 400);
    }

    const participant = await AuctionParticipant.create({
      auction: auction._id,
      user: req.user._id,
      inGameName,
      inGameId,
      primaryRole,
      secondaryRole,
      stats: stats || {},
      basePrice: basePrice || auction.startingBid,
      status: PARTICIPANT_STATUS.REGISTERED,
    });

    return successResponse(res, 'Registration submitted for organizer approval', participant, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update auction status (Start, Pause, Resume, End)
// @route   PUT /api/auctions/:id/status
// @access  Private (Admin / Organizer)
export const updateAuctionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!Object.values(AUCTION_STATUS).includes(status)) {
      return errorResponse(res, 'Invalid auction status', 400);
    }

    const auction = await Auction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!auction) {
      return errorResponse(res, 'Auction not found', 404);
    }

    return successResponse(res, `Auction status updated to ${status}`, auction);
  } catch (error) {
    next(error);
  }
};

