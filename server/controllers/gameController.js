import Game from '../models/Game.js';
import Auction from '../models/Auction.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Get all games
// @route   GET /api/games
// @access  Public
export const getAllGames = async (req, res, next) => {
  try {
    const games = await Game.find({ isActive: true }).sort({ title: 1 });
    return successResponse(res, 'Games retrieved successfully', games);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single game by slug with its active auctions
// @route   GET /api/games/:slug
// @access  Public
export const getGameBySlug = async (req, res, next) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug.toLowerCase(), isActive: true });
    if (!game) {
      return errorResponse(res, 'Game not found', 404);
    }

    const auctions = await Auction.find({ game: game._id })
      .populate('organizer', 'username fullName')
      .sort({ startTime: 1 });

    return successResponse(res, 'Game details retrieved', {
      game,
      auctions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create new game
// @route   POST /api/games
// @access  Private/Admin
export const createGame = async (req, res, next) => {
  try {
    const { title, slug, developer, genre, bannerImage, iconImage, description, defaultRoles } = req.body;

    const gameExists = await Game.findOne({
      $or: [{ slug: slug.toLowerCase() }, { title }],
    });

    if (gameExists) {
      return errorResponse(res, 'Game with this title or slug already exists', 400);
    }

    const game = await Game.create({
      title,
      slug: slug.toLowerCase(),
      developer,
      genre,
      bannerImage,
      iconImage,
      description,
      defaultRoles: defaultRoles || [],
    });

    return successResponse(res, 'Game created successfully', game, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update game
// @route   PUT /api/games/:id
// @access  Private/Admin
export const updateGame = async (req, res, next) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!game) {
      return errorResponse(res, 'Game not found', 404);
    }

    return successResponse(res, 'Game updated successfully', game);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete game
// @route   DELETE /api/games/:id
// @access  Private/Admin
export const deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!game) {
      return errorResponse(res, 'Game not found', 404);
    }
    return successResponse(res, 'Game deleted/deactivated successfully');
  } catch (error) {
    next(error);
  }
};

