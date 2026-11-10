import Team from '../models/Team.js';
import Game from '../models/Game.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Get all teams for user or game
// @route   GET /api/teams
// @access  Public
export const getTeams = async (req, res, next) => {
  try {
    const { gameSlug, myTeams } = req.query;
    const query = {};

    if (gameSlug) {
      const game = await Game.findOne({ slug: gameSlug.toLowerCase() });
      if (game) query.game = game._id;
    }

    if (myTeams && req.user) {
      query.owner = req.user._id;
    }

    const teams = await Team.find(query)
      .populate('game', 'title slug genre')
      .populate('owner', 'username fullName')
      .populate('roster.player', 'username fullName inGameId')
      .sort({ createdAt: -1 });

    return successResponse(res, 'Teams retrieved', teams);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team by ID
// @route   GET /api/teams/:id
// @access  Public
export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('game')
      .populate('owner', 'username fullName')
      .populate('roster.player', 'username fullName inGameId');

    if (!team) {
      return errorResponse(res, 'Team not found', 404);
    }

    return successResponse(res, 'Team details retrieved', team);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new gaming team / clan
// @route   POST /api/teams
// @access  Private (Team Owner / Gamer)
export const createTeam = async (req, res, next) => {
  try {
    const { name, tag, gameId, gameSlug, logo, description, allocatedBudget } = req.body;

    let targetGameId = gameId;
    if (!targetGameId && gameSlug) {
      const game = await Game.findOne({ slug: gameSlug.toLowerCase() });
      if (game) targetGameId = game._id;
    }

    if (!targetGameId) {
      return errorResponse(res, 'Please provide a valid game for this team', 400);
    }

    const teamExists = await Team.findOne({ name });
    if (teamExists) {
      return errorResponse(res, 'Team with this name already exists', 400);
    }

    const budget = allocatedBudget || 50000;

    const team = await Team.create({
      name,
      tag: tag.toUpperCase(),
      game: targetGameId,
      owner: req.user._id,
      logo,
      description,
      allocatedBudget: budget,
      remainingBudget: budget,
      roster: [],
    });

    return successResponse(res, 'Team created successfully', team, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update team purse / budget
// @route   PUT /api/teams/:id/budget
// @access  Private (Admin / Organizer)
export const updateTeamBudget = async (req, res, next) => {
  try {
    const { allocatedBudget } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { allocatedBudget, remainingBudget: allocatedBudget },
      { new: true }
    );

    if (!team) {
      return errorResponse(res, 'Team not found', 404);
    }

    return successResponse(res, 'Team budget updated', team);
  } catch (error) {
    next(error);
  }
};

